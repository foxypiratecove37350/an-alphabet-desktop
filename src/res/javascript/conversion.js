const marked = require('marked');
const fs = require('fs');
const path = require('path');
const { shell } = require('electron');

const alphabets = {};

fs.readFile(path.join(__dirname, "../../data/alphabets.mdtbl"), 'utf8', (err, data) => {
	if (err) {
		console.error(err);
		return;
	}
	
	let lexedData = marked.lexer(data).find(token => token.type === 'table')
	alphabets.letters = lexedData.rows.map(row => row.map(cell => cell.text));
	alphabets.allAlphabets = lexedData.header.map(cell => cell.text.toLowerCase());

	alphabets.allAlphabets.forEach((alphabet, index) => {
		Object.defineProperty(alphabets, `INDEX_${alphabet.toUpperCase()}`, {
			value: index,
			configurable: false,
			writable: false,
		});
	});

	alphabets.getLetterConversions = (letter) => {
		let conversionsTable;
		let alphabet;
		
		for (let i = 0; i < alphabets.letters.length; i++) {
			if (alphabets.letters[i].includes(letter.toLowerCase())) {
				conversionsTable = alphabets.letters[i].slice();
			}
		}

		alphabet = alphabets.allAlphabets[conversionsTable.indexOf(letter.toLowerCase())].toLowerCase();

		

		if (letter.toUpperCase() == letter) {
			for (let i = 0; i < conversionsTable.length; i++) {
				try {
					conversionsTable[i] = conversionsTable[i].toUpperCase();
				} catch (error) {
					continue;
				}
			}
		}
		
		conversionsTable[alphabets.INDEX_MORSE] += " ";

		return { conversionsTable, alphabet };
	}
});

document.addEventListener('DOMContentLoaded', () => {
	const textarea = document.querySelector("#text");
	const textOutput = document.querySelector('.output-text');
	const selectDiv = document.querySelector('.select');
	const selectOptions = [...document.querySelectorAll('.select > .option:not(.selected)')];
	const selectLabel = document.querySelector('p.label[for="target-alphabet"]');
	const selectedTargetAlphabet = document.querySelector('.select > .option.selected');
	const informationsDiv = document.querySelector('.informations');
	const copyIcon = document.querySelector('.output .icon');
	const newTabLinks = [...document.querySelectorAll('a[href][target="_blank"]')];

	informationsDiv.textContent = "To " + selectedTargetAlphabet.textContent.toLowerCase();

	const updateOutput = () => {
		let textLetters = Array.from(textarea.value);
		let convertedLetter;

		for (let i = 0; i < textLetters.length; i++) {
			if (/^[a-z\u0400-\u04FF\u0370-\u03FF\u0600-\u06FF\u10A0-\u10FF\u0590-\u05FF]$/.test(textLetters[i].toLowerCase())) {
				convertedLetter = alphabets.getLetterConversions(textLetters[i]);
				textLetters[i] = convertedLetter.conversionsTable[alphabets["INDEX_" + selectedTargetAlphabet.textContent.toUpperCase()]];
			}
		}

		textOutput.textContent = textLetters.join("");
		if (textOutput.textContent != "") {
			textOutput.classList.add("has-text");
			informationsDiv.textContent = "From " + convertedLetter.alphabet + " to " + selectedTargetAlphabet.textContent.toLowerCase();
		} else {
			textOutput.classList.remove("has-text");
			textOutput.textContent = "Converted text";
			informationsDiv.textContent = "To " + selectedTargetAlphabet.textContent.toLowerCase();
		}
	}

	textarea.addEventListener('input', () => {
		updateOutput();
	});

	selectLabel.addEventListener('click', () => {
		selectDiv.click();
	});

	selectOptions.forEach(option => option.addEventListener('click', () => {
		selectedTargetAlphabet.classList.replace(selectedTargetAlphabet.textContent.toLocaleLowerCase(), option.textContent.toLocaleLowerCase());
		option.classList.replace(option.textContent.toLocaleLowerCase(), selectedTargetAlphabet.textContent.toLocaleLowerCase());
		selectedTargetAlphabet.textContent = [option.textContent, option.textContent = selectedTargetAlphabet.textContent][0];
		updateOutput();
	}));

	document.body.addEventListener('click', (e) => {
		if (!e.composedPath().includes(selectDiv)) {
			selectDiv.classList.remove('active');
		}
	});

	selectDiv.addEventListener('click', () => {
		selectDiv.classList.toggle('active');
	});

	copyIcon.addEventListener('click', () => {
		navigator.clipboard.writeText(textOutput.textContent);
		copyIcon.blur();
	});

	newTabLinks.forEach(link => link.addEventListener('click', (e) => {
		e.preventDefault();
		shell.openExternal(link.href);
	}));
});