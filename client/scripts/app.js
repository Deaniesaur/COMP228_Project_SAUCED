"use strict";

let counter = 0;

const questionTypeDiv = `
<div class="form-check form-check-inline">
  <input
    class="form-check-input"
    type="radio"
    name="inlineRadioOptions"
    id="multipleChoice"
    value="1"
  />
  <label class="form-check-label" for="multipleChoice">
    MULTIPLE CHOICE
  </label>
</div>
<div class="form-check form-check-inline">
  <input
    class="form-check-input"
    type="radio"
    name="inlineRadioOptions"
    id="shortAnswer"
    value="2"
  />
  <label class="form-check-label" for="shortAnswer">
    SHORT ANSWER
  </label>
</div>
<div class="form-check form-check-inline">
  <input
    class="form-check-input"
    type="radio"
    name="inlineRadioOptions"
    id="checkBoxes"
    value="3"
  />
  <label class="form-check-label" for="checkBoxes">
    CHECK BOXES
  </label>
</div>
<div class="form-check form-check-inline">
  <input
    class="form-check-input"
    type="radio"
    name="inlineRadioOptions"
    id="trueFalse"
    value="4"
  />
  <label class="form-check-label" for="trueFalse">
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
  return `
  <div class="text-center row" id="question-body">
  <div class="col-9">
  <p>QUESTION ${counter + 1}</p>
  <textarea id="question${counter + 1}" name="question" rows="2" cols="63">
  WHAT DO YOU THINK ABOUT OUR WEBSITE?
                      </textarea
  >
  </div>
  <div class="col-3">
  <a href="javascript:deleteQuestion(${counter})">
<p class="text-center" id="trash-icon"><i class="fas fa-trash fa-4x"></i></p
></a>
  
  </div>
  </div>`;
}

const newQuestionButton = `<a href="javascript:addNewQuestionType()">
<p class="text-center"><i class="fas fa-plus fa-2x"></i></p
></a>`;

const submitSurveyButton = `
<br />
          <button
            type="button"
            class="btn btn-secondary"
            onclick="submitSurveyQuestions()"
          >
            SUBMIT SURVEY
          </button>`;

function getMultipleChoiceQuestion(i) {
  return `
<div class="form-check form-check-inline" id="option-${i}">
<label class="form-check-label" for="question${counter}">
<input type="text" class="form-control" id="question${i}" name="question${counter}" placeholder="Option ${i}">
  <a href="javascript:editOption(${counter - 1}, ${i})">
<p class="text-center" id="edit-icon"><i class="fas fa-edit"></i></p
></a>
<a href="javascript:deleteOption(${counter - 1}, ${i})">
<p class="text-center" id="edit-icon"><i class="fas fa-trash"></i></p
></a>
</label><br>
</div>`;
}

function getMultipleChoiceOption(i, j) {
  return `
<label class="form-check-label" for="question${i}">
<input type="text" class="form-control" id="question${i}" placeholder="Option ${j}" enabled>
 
  <a href="javascript:editOption(${i}, ${j})">
<p class="text-center" id="edit-icon"><i class="fas fa-edit"></i></p
></a>
<a href="javascript:deleteOption(${i}, ${j})">
<p class="text-center" id="edit-icon"><i class="fas fa-trash"></i></p
></a>
</label> <br>`;
}

const shortAnswerQuestion = `
<br />
<br />
<label class="form-check-label short-answer" for=""></label>
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
  let response;
  let options = document
      .querySelector("#question-type")
      .querySelectorAll(".form-check-input"),
    i;
  for (i = 0; i < options.length; i++) {
    if (options[i].checked) response = parseInt(options[i].value);
  }

  if (response == undefined) {
    window.alert("Please choose a question type.");
    return;
  }

  let div = document.createElement("div");
  div.id = `question-main-${counter}`;
  div.innerHTML = getQuestionBody();

  document.getElementById("main-section").appendChild(div);
  $(div).hide().fadeIn(1000);

  counter++;
  displayQuestionOptions(response);

  document.getElementById("question-type").remove();
  addNewQuestionButton();
  displaySubmitButton();
}

function initMultipleChoiceOptions() {
  let optionsHtml = "";
  for (let i = 1; i < 5; i++) {
    optionsHtml += getMultipleChoiceQuestion(i);
  }
  return optionsHtml;
}

function addNewOptionButton(i, j) {
  return `
<div class="form-check form-check-inline" id="option-${j}" style="vertical-align:top">
<p class="text-center" id="edit-icon">
  <a href="javascript:addNewOption(${i - 1}, ${j})">
<i class="fas fa-plus"></i></a></p
>
</div>`;
}

function addNewOption(i, j) {
  if (j > 5) {
    window.alert("You can't add more than 5 options in the current version.");
    return;
  }
  let questionDiv = document.getElementById(`answer-${i}`);
  let option = questionDiv.children[j + 1];
  option.innerHTML = getMultipleChoiceOption(i, j);
  let div = document.createElement("div");
  div.className = "form-check form-check-inline";
  div.style = "vertical-align:top";
  div.id = `option-${j + 1}`;
  div.innerHTML = addNewOptionButton(i + 1, j + 1);
  questionDiv.appendChild(div);
}

function displayMultipleChoice() {
  let div = document.createElement("div");
  div.id = `answer-${counter - 1}`;

  div.innerHTML =
    "<br><br>" + initMultipleChoiceOptions() + addNewOptionButton(counter, 5);
  div.className = "text-center";
  document.getElementById("main-section").appendChild(div);
  $(div).hide().fadeIn(1000);
}

function displayShortAnswer() {
  let div = document.createElement("div");
  div.id = `answer-${counter - 1}`;
  div.innerHTML = shortAnswerQuestion;
  div.className = "text-center";
  document.getElementById("main-section").appendChild(div);
  $(div).hide().fadeIn(1000);
}

function displayQuestionOptions(i) {
  switch (i) {
    case 1:
      displayMultipleChoice();
      break;
    case 2:
      displayShortAnswer();
      break;
    case 3:
      displayCheckBoxes();
      break;
    case 4:
      displayTrueFalse();
      break;
  }
}

function deleteQuestion(i) {
  i = parseInt(i);
  if (
    i == 0 &&
    document.getElementById(`question-main-${i + 1}`) == undefined
  ) {
    $(`#btn-submit-survey`).fadeOut(1000, function () {
      $(this).remove();
    });
  }
  $(`#question-main-${i}`).fadeOut(1000, function () {
    $(this).remove();
  });
  $(`#answer-${i}`).fadeOut(1000, function () {
    $(this).remove();
  });
  for (let j = i + 1; j < counter; j++) {
    let parent = document.getElementById(`question-main-${j}`);
    parent.id = `question-main-${j - 1}`;
    parent.querySelector("p").textContent =
      parent.querySelector("p").textContent.substring(0, 9) + j;
    parent.querySelector("a").href = `javascript:deleteQuestion(${j - 1})`;
    parent = document.getElementById(`answer-${j}`);
    parent.id = `answer-${j - 1}`;
    console.log(parent);
    [...parent.querySelectorAll(`#question${j + 1}`)].forEach((e) => {
      e.id = `question${j}`;
      e.parentElement.htmlFor = `question${j}`;
    });
    for (let k = 1; k < 10; k++) {
      let child = parent.querySelectorAll("div")[k - 1];
      if (child == undefined) break;
      let anchors = child.querySelectorAll("a");
      console.log(child);
      switch (anchors.length) {
        case 0:
          break;
        case 1:
          anchors[0].href = `javascript:addNewOption(${j - 1}, ${k})`;
          break;
        case 2:
          anchors[0].href = `javascript:editOption(${j - 1}, ${k})`;
          anchors[1].href = `javascript:deleteOption(${j - 1}, ${k})`;
          break;
      }
    }
  }
  counter--;
}

function editOption(i, j) {
  window.alert(
    "Enhanced edit is not implemented yet. You can enter your option inside the text area for now."
  );
  return;
  let questionDiv = document.getElementById(`answer-${i}`);
  questionDiv = questionDiv.querySelectorAll("div")[j - 1];
  let optionText = questionDiv.querySelectorAll("p")[0];
  optionText.textContent = "Hello World";
  console.log(optionText);
}

function deleteOption(i, j) {
  let questionDiv = document.getElementById(`answer-${i}`);
  questionDiv.children[j + 1].remove();
  for (let k = j + 1; k < 10; k++) {
    console.log(`k is =  ${k}`);
    let optionDiv = questionDiv.children[k];
    if (optionDiv == undefined) break;
    optionDiv.id = `option-${k}`;
    let anchors = optionDiv.querySelectorAll("a");
    switch (anchors.length) {
      case 0:
        break;
      case 1:
        anchors[0].href = `javascript:addNewOption(${i}, ${k - 1})`;
        break;
      case 2:
        anchors[0].href = `javascript:editOption(${i}, ${k - 1})`;
        anchors[1].href = `javascript:deleteOption(${i}, ${k - 1})`;
        break;
    }
  }
}

function getQuestionType(divv) {
  // let a = divv.classList.contains("short-answer");
  // if (a.length > 0) return "Short Answer";
  // console.log(isActive);
  divv = Array.from(divv);
  console.log(divv);
  const activeEl = Array.prototype.find.call(divv, (item) =>
    item.classList.contains("short-answer")
  );
  console.log(activeEl);
  return "Multiple Choice";
}

function submitSurveyQuestions() {
  let http = new XMLHttpRequest();
  let url = "/survey/create";
  let description = document.getElementById("description").value;
  let surveyQuestions = [];
  let questionsDiv = document.getElementsByName("question");

  questionsDiv.forEach((question) => {
    let surveyQuestion = {};
    surveyQuestion["question"] = question.value;
    // surveyQuestion["type"] = "Multiple Choice";
    surveyQuestion["choices"] = [];

    let optionsDiv = document.getElementsByName(question.id);

    optionsDiv.forEach((option) => {
      surveyQuestion.choices.push(option.value);
    });
    if (surveyQuestion.choices.length == 0) {
      surveyQuestion["type"] = "Short Answer";
    } else {
      surveyQuestion["type"] = "Multiple Choice";
    }

    surveyQuestions.push(surveyQuestion);
  });

  console.log(surveyQuestions);

  let payload = {
    title: "sampleTitle",
    description: description,
    questions: surveyQuestions,
  };

  http.open("POST", url, true);

  // http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  http.setRequestHeader("Content-type", "application/json;charset=UTF-8");

  http.onreadystatechange = function () {
    if (http.readyState == 4 && http.status == 200) {
      window.location = http.responseURL;
    }
  };
  // http.send(params);
  http.send(JSON.stringify(payload));
}
