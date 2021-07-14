"use strict";

let counter = 0;

const questionTypeDiv = `
<div class="form-check form-check-inline">
  <input
    class="form-check-input"
    type="radio"
    name="inlineRadioOptions"
    id="inlineRadio1"
    value="option1"
  />
  <label class="form-check-label" for="inlineRadio1">
    MULTIPLE CHOICE
  </label>
</div>
<div class="form-check form-check-inline">
  <input
    class="form-check-input"
    type="radio"
    name="inlineRadioOptions"
    id="inlineRadio2"
    value="option2"
  />
  <label class="form-check-label" for="inlineRadio2">
    SHORT ANSWER
  </label>
</div>
<div class="form-check form-check-inline">
  <input
    class="form-check-input"
    type="radio"
    name="inlineRadioOptions"
    id="inlineRadio3"
    value="option3"
  />
  <label class="form-check-label" for="inlineRadio3">
    CHECK BOXES
  </label>
</div>
<div class="form-check form-check-inline">
  <input
    class="form-check-input"
    type="radio"
    name="inlineRadioOptions"
    id="inlineRadio3"
    value="option3"
  />
  <label class="form-check-label" for="inlineRadio3">
    TRUE / FALSE
  </label>
</div>
<br />
<br />
<button type="button" class="btn btn-secondary" onclick="chooseNewQuestionType()">
  ADD
</button>
`;

function getQuestionBody() {
  const mainQuestionDiv = `<div class="text-center">
  <p>QUESTION ${counter + 1}</p>
  <textarea id="question" name="question" rows="2" cols="63">
  WHAT DO YOU THINK ABOUT OUR WEBSITE?
                      </textarea
  >
  </div>`;

  return mainQuestionDiv;
}

const newQuestionButton = `<a href="javascript:addNewQuestionType()">
<p class="text-center"><i class="fas fa-plus fa-2x"></i></p
></a>`;

const submitSurveyButton = `
          <button
            type="button"
            class="btn btn-secondary"
            onclick="submitSurveyQuestions()"
          >
            SUBMIT SURVEY
          </button>`;

const multipleChoiceQuestion = `
<br />
<br />
<div class="form-check form-check-inline">
<input
  class="form-check-input"
  type="radio"
  name="inlineRadioOptions"
  id="inlineRadio1"
  value="option1"
/>
<label class="form-check-label" for="inlineRadio1">
  Option 1
</label>
</div>
<div class="form-check form-check-inline">
<input
  class="form-check-input"
  type="radio"
  name="inlineRadioOptions"
  id="inlineRadio2"
  value="option2"
/>
<label class="form-check-label" for="inlineRadio2">
Option 2
</label>
</div>
<div class="form-check form-check-inline">
<input
  class="form-check-input"
  type="radio"
  name="inlineRadioOptions"
  id="inlineRadio3"
  value="option3"
/>
<label class="form-check-label" for="inlineRadio3">
Option 3
</label>
</div>
<div class="form-check form-check-inline">
<input
  class="form-check-input"
  type="radio"
  name="inlineRadioOptions"
  id="inlineRadio3"
  value="option3"
/>
<label class="form-check-label" for="inlineRadio3">
Option 4
</label>
</div>
<br />
<br />`;

const shortAnswerQuestion = `
<br />
<br />
<input class="form-control" type="text" placeholder="The participants will fill-in this area." disabled>
<br />
<br />`;

function addNewQuestionButton() {
  let div = document.createElement("div");
  div.id = "btn-new-question";
  div.innerHTML = newQuestionButton;
  document.getElementById("main-section").appendChild(div);
  $(div).hide().fadeIn(1000);
}

addNewQuestionButton();

function displaySubmitButton() {
  let div = document.createElement("div");
  div.className = "text-center";
  div.id = "btn-submit-survey";
  div.innerHTML = submitSurveyButton;
  document.getElementById("main-section").appendChild(div);
  $(div).hide().fadeIn(1000);
}

function addNewQuestionType() {
  if (counter > 4) {
    window.alert(
      "You can have a maximum of 5 questions in the current version."
    );
    return;
  }
  console.log("Add new question.");
  let div = document.createElement("div");
  div.id = "question-type";
  div.innerHTML = questionTypeDiv;
  div.className = "text-center";
  document.getElementById("main-section").appendChild(div);
  $(div).hide().fadeIn(1000);
  if (counter !== 0) document.getElementById("btn-submit-survey").remove();
  document.getElementById("btn-new-question").remove();
}

/* END OF THE ADD NEW QUESTION TYPE BUTTON */

function chooseNewQuestionType() {
  console.log("Choose new question.");
  let div = document.createElement("div");
  div.id = "question-main";
  div.innerHTML = getQuestionBody();
  counter++;
  document.getElementById("main-section").appendChild(div);
  $(div).hide().fadeIn(1000);

  let response;
  let isChecked = false;
  let options = document.querySelectorAll(".form-check-input"),
    i;
  for (i = 0; i < options.length; i++) {
    if (options[i].checked) response = i;
  }

  displayQuestionOptions(response);
  document.getElementById("question-type").remove();
  addNewQuestionButton();
  displaySubmitButton();
}

function displayMultipleChoice() {
  console.log("Add multiple choice question.");
  let div = document.createElement("div");
  div.id = "multiple-choice";
  div.innerHTML = multipleChoiceQuestion;
  div.className = "text-center";
  document.getElementById("main-section").appendChild(div);
  $(div).hide().fadeIn(1000);
}

function displayShortAnswer() {
  console.log("Add short answer question.");
  let div = document.createElement("div");
  div.id = "short-answer";
  div.innerHTML = shortAnswerQuestion;
  div.className = "text-center";
  document.getElementById("main-section").appendChild(div);
  $(div).hide().fadeIn(1000);
}

function displayQuestionOptions(i) {
  switch (i) {
    case 0:
      console.log("Option 1 is selected.");
      displayMultipleChoice();
      break;
    case 1:
      console.log("Option 2 is selected.");
      displayShortAnswer();
      break;
    case 2:
      console.log("Option 3 is selected.");
      displayCheckBoxes();
      break;
    case 3:
      console.log("Option 4 is selected");
      displayTrueFalse();
      break;
  }
}
