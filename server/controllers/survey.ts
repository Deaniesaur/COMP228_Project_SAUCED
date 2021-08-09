import express, { Request, Response, NextFunction } from "express";
import Survey from "../models/survey";
import SurveyResponse from "../models/response";
import mongoose, { mongo } from "mongoose";
import pdf from 'pdf-creator-node';
import fs from 'fs';

//import Util Function
import { GetDisplayName } from "../util";

interface LooseObject {
  [key: string]: any
}

export function DisplayPublicSurveys(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  let today = new Date().toISOString().slice(0, 10);

  let filter = {
    expiry: { $gte: today },
    startDate: { $lte: today },
    active: true,
  };

  Survey.find(filter, function (err, surveys) {
    if (err) {
      return console.error(err);
    }

    res.render("index", {
      title: "SAUCED | Public Surveys",
      page: "surveys",
      surveys: surveys,
      display: GetDisplayName(req),
    });
  });
}

export function DisplayPrivateSurveys(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  let user = req.user as UserDocument;
  let filter = {
    owner: user.username,
  };

  Survey.find(filter, function (err, surveys) {
    if (err) {
      return console.error(err);
    }

    res.render("index", {
      title: "SAUCED | Private Surveys",
      page: "surveys",
      surveys: surveys,
      display: GetDisplayName(req),
    });
  });
}

export function DisplayNewSurveyPage(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  res.render("index", {
    title: "SAUCED | New Survey",
    page: "newSurvey",
    display: GetDisplayName(req),
  });
}

export function DisplayUpdateSurveyPage(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  let surveyId = req.params.id;
  let surveyFound: any;
  let user = req.user as UserDocument;

  Survey.findOne(
    { _id: surveyId, owner: user.username },
    function (err: any, survey: any) {
      if (err) {
        return console.error(err);
      }

      console.log(survey);
      if (survey === null) {
        res.redirect("../public");
      } else {
        surveyFound = survey.toObject();
        res.render("index", {
          title: "SAUCED | Edit Survey",
          page: "editSurvey",
          survey: surveyFound,
          sid: surveyId,
          display: GetDisplayName(req),
        });
      }
    }
  );
}

export function UpsertSurvey(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  let surveyId = mongoose.Types.ObjectId(req.params.id);
  let today = new Date();
  let user = req.user as UserDocument;
  let surveyThumbnail = null;

  //instantiate a Survey object
  let survey = new Survey({
    title: req.body.title,
    description: req.body.description,
    thumbnail: surveyThumbnail,
    owner: user.username,
    questions: req.body.questions,
    created: today,
    updated: today,
    expiry: req.body.expiry,
    startDate: req.body.startDate,
    active: req.body.active,
  });

  if (req.body.create == true) {
    Survey.create(survey, (err, survey) => {
      if (err) {
        console.error(err);
        res.end(err);
      }

      console.log("CREATED", survey._id);
    });
  } else {
    Survey.updateOne(
      { _id: surveyId },
      survey.toObject(),
      {},
      (err, survey) => {
        if (err) {
          console.error(err);
          res.end();
        }

        console.log("UPDATED", survey._id);
      }
    );
  }

  res.redirect("/");
}

export function DisplaySurveyById(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  let surveyId = req.params.id;
  let surveyFound: any;

  Survey.findOne({ _id: surveyId }, function (err: any, survey: any) {
    if (err) {
      return console.error(err);
    }

    surveyFound = survey.toObject();
    res.render("index", {
      title: "SAUCED | Answer Survey",
      page: "respondSurvey",
      survey: surveyFound,
      display: GetDisplayName(req),
    });
  });
}

export function SubmitResponse(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  let surveyId = req.params.id;
  let answers = [];
  let count = 0;

  // TODO: Insert Code to retrieve answers here as an Array
  while (true) {
    let value = req.body["question" + count];
    if (value == undefined) break;

    console.log(`Questions ${count}`, value);
    answers.push(value);
    count++;
  }

  let newResponse = new SurveyResponse({
    surveyId: surveyId,
    surveyOwner: "User",
    answers: answers,
    created: new Date(),
  });

  SurveyResponse.create(newResponse, (err, response) => {
    if (err) {
      console.error(err);
      res.end(err);
    }
  });

  res.redirect("/survey/public");
}

export function DeleteSurvey(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  let id = req.params.id;

  Survey.deleteOne({ _id: id }, {}, (err) => {
    if (err) {
      console.error(err);
      res.end(err);
    }
  }).then(() => {
    SurveyResponse.deleteMany({ surveyId: id }, {}, (err) => {
      if (err) {
        res.end();
      }

      console.log(`Survey: ${id} DELETED`);
      res.redirect("/survey/private");
    });
  });
}

export function DisplaySurveyAnalysis(
  req: Request,
  res: Response,
  next: NextFunction
): any {
  // let analysis = req.body.analysis;

  console.log('Dean here!');
  res.render("index", {
    title: "SAUCED | Analysis",
    page: "analysis",
    display: GetDisplayName(req),
  });
}

export function CreateSurveyAnalysis(
  req: Request,
  res: Response,
  next: NextFunction
): any {
  let surveyId = req.params.id;

  let getAnalysisList = getSurveyAnalysisData(req, res, next)
  getAnalysisList.then((analysis) => {
    console.log('analysisList', analysis);

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(analysis));
  })
}

//WIP
export function DownloadPDF(
  req: Request,
  res: Response,
  next: NextFunction
): any {
  // let analysis = req.body.analysis;
  // console.log('analysis', analysis);\

  const options = {
    format: "A3",
    orientation: "portrait",
    border: "10mm",
    header: {
      height: "45mm",
      contents: '<div style="text-align: center;">Author: SAUCED</div>'
    },
    footer: {
      height: "28mm",
      contents: {
          first: 'Cover page',
          2: 'Second page', // Any page number is working. 1-based index
          default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
          last: 'Last Page'
      }
    }
  };
  
  let path = "./output/analysis.pdf";
  let html = fs.readFileSync("template.html", "utf8");
  let getAnalysisList = getSurveyAnalysisData(req, res, next);

  // console.log('template', html);

  getAnalysisList.then((analysisList) => {
    let document = {
      html: html,
      data: {
        title: 'Hello Dean',
        analysis: analysisList
      },
      path: path,
      type: "",
    };

    console.log(document);

    pdf
      .create(document, options)
      .then((pdfRes: any) => {
        console.log(pdfRes);
      })
      .catch((pdfError: any) => {
        console.error(pdfError);
      });

    res.setHeader('Content-Type', 'text/html');
    res.send(path);
  });
}

async function getSurveyAnalysisData(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<LooseObject> {
  let surveyId = req.params.id;
  let analysisList: LooseObject = [];
  let survey: LooseObject = await Survey.findOne({ _id: surveyId });
  let responses = await SurveyResponse.find({ surveyId: surveyId });

  let isShortAnswer: Array<boolean> = [];
  let questions = survey.questions;

  questions.forEach((question: any) => {
    let analysis: LooseObject = {};
    let answers: LooseObject = {};
    
    analysis['question'] = question.question;
    analysis['type'] = question.type;

    if(question.type == 'Short Answer'){
      isShortAnswer.push(true);
      answers = [];
    }else{
      isShortAnswer.push(false);
      let options = question.choices;

      options.forEach((option: string) => {
        answers[option] = 0;
      })
    }

    analysis['answers'] = answers;
    analysisList.push(analysis);
  });

  responses.forEach((response: LooseObject) => {
    let answers = response.answers;

    for(let i = 0; i < answers.length; i++){
      if(isShortAnswer[i]){
        analysisList[i]['answers'].push(answers[i]);
      }
      else{
        analysisList[i]['answers'][answers[i]] += 1;
      }
    }
  });

  return analysisList;
}