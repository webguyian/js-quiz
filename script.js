var $ = document.querySelector.bind(document),
    doc = document,
    quizObj = [{question: "In which sport would you use a chucker?",choices: ["Polo", "Cricket", "Badminton"],answer: 0 }, {question: "What is the national emblem of Canada?",choices: ["Crown", "Hockey stick", "Maple leaf"],answer: 2 }, {question: "Are gorillas carnivores, omniovores, or herbivores?",choices: ["Carnivores", "Omnivores", "Herbivores"],answer: 2 }, {question: "Free Willey was a film about what?",choices: ["Donkey", "Whale", "Prioner"],answer: 1 }, {question: "What star sign is represented by the water carrier?",choices: ["Aquarius", "Gemini", "Libra"],answer: 0 }, {question: "Who wrote A Tale of Two Cities?",choices: ["Emily Dickenson", "Oliver Twist", "Charles Dickens"],answer: 2 }, {question: "What is the square route of 250,000?",choices: ['500', '2500', '5000'],answer: 0 }, {question: "Which actor starred in the Die Hard film series?",choices: ["Robert DeNiro", "Bruce Willis", "Brad Pitt"],answer: 1 }, {question: "Lagos is the capitol of which African country?",choices: ["Nigeria", "Zimbabwe", "Ghana"],answer: 0 }, {question: "Who painted the Mona Lisa?",choices: ["Michaelangelo", "Pablo Picasso", "Leonardo da Vinci"],answer: 2 }],
    quizLength = quizObj.length,
    questionCounter = 1,
    slideCounter = 0,
    currentColor = 0,
    currentAnimation = 0,
    givenAnswers = [],
    colors = ['pink', 'yellow', 'orange', 'green', 'blue'],
    animations = ['slideUp', 'slideLeft', 'slideDown'];

function appendFields() {
  var content = doc.querySelector('.content'),
  i = 0,
  zIndexCounter = 900;

  for (i; i < quizLength; i++) {
    var entry = doc.createElement('div'),
    heading = doc.createElement('h3'),
    choicesField = doc.createElement('fieldset');

    currentColor < 5 ? currentColor : currentColor = 0;

    entry.className = 'entry ' + colors[currentColor] + ' z' + zIndexCounter;
    heading.className = 'heading';
    choicesField.className = 'choices';
    heading.innerHTML = quizObj[i].question;

    var frag = doc.createDocumentFragment(),
    j = 0,
    choices = quizObj[i].choices;

    for (j; j < choices.length; j++) {
      var radioInput = doc.createElement('input'),
      choiceLabel = doc.createElement('label'),
      properID = choices[j].toLowerCase().replace(/\s+/g, '');

      radioInput.setAttribute('type', 'radio');
      radioInput.setAttribute('id', properID);
      radioInput.setAttribute('name', 'question-' + (i + 1));
      radioInput.setAttribute('value', j);
      choiceLabel.setAttribute('for', properID);
      choiceLabel.innerHTML = choices[j];

      frag.appendChild(radioInput);
      frag.appendChild(choiceLabel);
    }

    choicesField.appendChild(frag);
    entry.appendChild(heading);
    entry.appendChild(choicesField);
    content.appendChild(entry);
    currentColor++;
    zIndexCounter -= 100;
  }
}

function initializeQuiz() {
  var btn = doc.querySelector('.btn'),
      intro = doc.querySelector('.intro'),
      entries = doc.querySelectorAll('.entry'),
      startQuiz = function() {
        btn.innerHTML = 'Next';
        intro.classList.add('slideLeft');
        btn.removeEventListener('click', startQuiz);
        btn.addEventListener('click', nextQuestion, false);
      };
  appendFields();
  btn.addEventListener('click', startQuiz, false);
}

function advanceSlide() {
  currentAnimation < 2 ? currentAnimation : currentAnimation = 0;
  currentAnimation++;
  questionCounter++;
  slideCounter++;
}

function getAnswer(entryCounter) {
  var group = doc.getElementsByName('question-' + questionCounter);

  for (var r = 0; r < group.length; r++) {
    var radioBtn = group.item(r);
    if (radioBtn.checked) {
      givenAnswers.push(parseInt(radioBtn.value, 10));
      return true;
    }
  }
  return false;
}

function nextQuestion() {

  if (questionCounter < 10) {
    var validator = getAnswer(questionCounter);
    if (validator) {
      slidePrevious();
      advanceSlide();
    } else {
      alert('Please answer the question.');
      validator = getAnswer(questionCounter);
    }

  } else if (questionCounter === quizLength) {
    var finalAnswer = getAnswer(questionCounter),
    realAnswers = getRealAnswers(quizObj),
    userScore = calculateResults(givenAnswers, realAnswers);
    resultsWindow(userScore, realAnswers.length);
    return userScore;
  }

}

function slidePrevious() {
  var entries = doc.querySelectorAll('.entry'),
      this_entry = entries[questionCounter],
      prev_entry = entries[questionCounter - 1];

  prev_entry.addEventListener('AnimationEnd', removeHidden(this_entry), false);
  prev_entry.classList.add(animations[currentAnimation]);
}

function removeHidden(elem) {
  elem.classList.remove('hidden');
}

function getRealAnswers(quizObj) {
  var answers = [];
  for (var a = 0; a < quizObj.length; a++) {
    answers.push(quizObj[a].answer);
  }
  return answers;
}

function calculateResults(userAnswers, realAnswers) {
  var results = [],
  score = 0,
  i = 0,
  len = userAnswers.length;

  for (i; i < len; i++) {
    var isCorrect = userAnswers[i] == realAnswers[i] ? true : false;
    if (isCorrect) {
      score++;
      results.push(isCorrect);
    } else {
      results.push(isCorrect);
    }
  }

  return score;
}

function resultsWindow(score, questions) {
  var modalOverlay = doc.querySelector('.modal-overlay'),
    modalBody = doc.querySelector('.modal-body'),
    closeBtn = doc.querySelector('.modal-close'),
    scoreText = doc.createElement('h3'),
    hideModal = function(evt) {
      var e = evt || window.event;
      e.preventDefault();
      modalOverlay.className += ' modal-hidden';
      window.location = '';
    };
  closeBtn.addEventListener('click', hideModal, false);
  modalOverlay.addEventListener('click', hideModal, false);
  scoreText.className = 'score';
  scoreText.innerHTML = score + ' out of ' + questions;
  modalBody.appendChild(scoreText);
  modalOverlay.classList.remove('modal-hidden');
}

initializeQuiz();