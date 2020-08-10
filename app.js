const fs = require("fs");
const chalk = require("chalk");
const {Form} = require("enquirer");
const {Select} = require("enquirer");

const error = chalk.bold.red;
const warning = chalk.bold.keyword("orange");
const ok = chalk.bold.green;
const textColor = chalk.bold.rgb(138, 60, 230);

const logError = error("ERROR!");
const thereAreNoNotes = warning("Warning! There are no notes!");
const noteSuccsessfulyAdded = ok("Note was succsesfully added!");
const usingAlreadyChozenTitle = warning("Warning! Using alredy chozen title!");
const noteDeletedSuccsessfuly = ok("Note was deleted succsessfully!");
const allNotesDeletedSuccsessfuly = ok("All notes were deleted succsessfully!");
const noteGotSuccsessfuly = ok("Note was succsessfully got!");
const allNotesGotSuccsessfuly = ok("All notes were succsessfuly got!");
const thereIsNoteWithThisTitle = warning("Warning! There is note with this title!");
const noteEditedSuccsessfuly = ok("Note was succsessfuly edited");
const goodBye = ok("Good bye!");

const version = "1.0";

console.log(
  textColor(
    "███    ██  ██████  ████████ ███████      ██████ ██████  ███████  █████  ████████  ██████  ██████ \n" +
      "████   ██ ██    ██    ██    ██          ██      ██   ██ ██      ██   ██    ██    ██    ██ ██   ██ \n" +
      "██ ██  ██ ██    ██    ██    █████       ██      ██████  █████   ███████    ██    ██    ██ ██████ \n" +
      "██  ██ ██ ██    ██    ██    ██          ██      ██   ██ ██      ██   ██    ██    ██    ██ ██   ██  \n" +
      "██   ████  ██████     ██    ███████      ██████ ██   ██ ███████ ██   ██    ██     ██████  ██   ██ " +
      chalk.bold.hex("#DEADED")(
        "   by async-devil   \nversion: " + version + "\n"
      )
  )
);

//ADD NOTES/////////////////////////////////////
function promptNotes() {
  var title, body;
  const prompt = new Form({
    name: "user",
    message: "Please input title and body of the note:",
    choices: [
      {
        name: "title",
        message: "Title",
        initial: "Title"
      },
      {
        name: "body",
        message: "Body",
        initial: "Lorem ipsum"
      }
    ]
  });

  prompt
    .run()
    .then(value => {
      title = value.title;
      body = value.body;
      addNotes(title, body);
    })
    .catch(console.error);
}

const addNotes = function(title, body) {
  const notes = loadNotes();

  const duplicateNotes = notes.filter(function(note) {
    return note.title === title;
  });

  if (duplicateNotes.length === 0) {
    notes.push({
      title: title,
      body: body
    });
    saveNotes(notes);
    console.log(noteSuccsessfulyAdded);
  } else {
    console.log(usingAlreadyChozenTitle);
  }
};
//////////////////////////////////////////

//GET NOTE BY TITLE///////////////////////
async function selectGetTitle(err) {
  var check = getNotesTitle();
  if (check != 0) {
    const prompt = new Select({
      name: "title",
      message: "Please select title",
      choices: getNotesTitle()
    });
    if (!err) {
      prompt
        .run()
        .then(answer => {
          var selectedTitle = answer;
          getNoteByTitle(selectedTitle);
        })
        .catch(console.error);
    }
  } else {
    console.log(thereAreNoNotes);
  }
}

const getNoteByTitle = function(title, err) {
  var data = loadNotes();

  var dataLenght = data.length;

  for (var i = 0; i != dataLenght; i++) {
    var dataFilter = data[i].title;
    if (dataFilter == title) break;
  }
  if (!err) {
    console.log("Title: " + data[i].title + "\nBody: " + data[i].body);
    console.log(noteGotSuccsessfuly);
  } else console.log(logError);
};
////////////////////////////////////////////

//GET ALL NOTES/////////////////////////////
function getAllNotes(err) {
  var data = loadNotes();

  var dataLenght = data.length;

  if (!err) {
    if (dataLenght != 0) {
      for (var i = 0; i != dataLenght; i++) {
        console.log(
          "Title: " + data[i].title + "\tBody: " + data[i].body + "\n"
        );
      }
      console.log(allNotesGotSuccsessfuly);
    } else console.log(thereAreNoNotes);
  } else console.log(logError);
}
///////////////////////////////////////

//DELETE NOTE BY TITLE/////////////////
async function selectDeleteTitle(err) {
  var check = getNotesTitle();
  if (check != 0) {
    const prompt = new Select({
      name: "title",
      message: "Please select title",
      choices: getNotesTitle()
    });
    if (!err) {
      prompt
        .run()
        .then(answer => {
          var selectedTitle = answer;
          deleteNoteByTitle(selectedTitle);
        })
        .catch(console.error);
    }
  } else {
    console.log(thereAreNoNotes);
  }
}

function deleteNoteByTitle(title, err) {
  var data = loadNotes();

  var dataLenght = data.length;

  for (var i = 0; i != dataLenght; i++) {
    var dataFilter = data[i].title;
    //console.log(dataFilter)
    if (dataFilter == title) {
      var titleIndex = i;
      break;
    }
  }
  if (!err) {
    data.splice(titleIndex, 1);
    console.log(noteDeletedSuccsessfuly);
    saveNotes(data);
  } else console.log(logError);
}
//////////////////////////////////

//DELETE ALL NOTES////////////////
function deleteAllNotes(err) {
  var check = getNotesTitle();
  if (check != 0) {
    var data = [];
    saveNotes(data);
    if (!err) console.log(allNotesDeletedSuccsessfuly);
    else console.log(logError);
  } else console.log(thereAreNoNotes);
}
//////////////////////////////////

//EDIT NOTE BY TITLE//////////////
function selectEditTitle(err) {
  var check = getNotesTitle();
  if (check != 0) {
    const prompt = new Select({
      name: "title",
      message: "Please select title",
      choices: check
    });
    if (!err) {
      prompt
        .run()
        .then(answer => {
          var selectedTitle = answer;
          promptEditNotes(selectedTitle);
        })
        .catch(console.error);
    }
  } else {
    console.log(thereAreNoNotes);
  }
}

function promptEditNotes(selectedTitle) {
  var title, body;
  const prompt = new Form({
    name: "user",
    message: "Please input title and body of the note:",
    choices: [
      {
        name: "title",
        message: "Title",
        initial: selectedTitle
      },
      {
        name: "body",
        message: "Body",
        initial: "Lorem ipsum"
      }
    ]
  });

  prompt
    .run()
    .then(value => {
      title = value.title;
      body = value.body;
      editNoteByTitle(title, body, selectedTitle);
    })
    .catch(console.error);
}

async function editNoteByTitle(title, body, selectedTitle, err) {
  var data = loadNotes();
  var check;

  var dataLenght = data.length;

  for (var i = 0; i != dataLenght; i++) {
    var dataFilter = data[i].title;
    if (dataFilter !== title) {
      if (dataFilter == selectedTitle) {
        var titleIndex = i;
      }
    } else {
      if (title !== selectedTitle) check = "0";
    }
  }
  if (!err) {
    if (check !== "0") {
      console.log(check);
      var editedNote = {
        title: title,
        body: body
      };
      data.splice(titleIndex, 1, editedNote);
      console.log(noteEditedSuccsessfuly);
      saveNotes(data);
    } else console.log(thereIsNoteWithThisTitle);
  } else console.log(logError);
}
/////////////////////////////

//GLOBAL/////////////////////
function getNotesTitle() {
  var data = loadNotes();
  var dataTitles = [];
  var dataLenght = data.length;

  for (i = 0; i != dataLenght; i++) {
    dataTitles.push(data[i].title);
  }
  if (dataLenght != 0) return dataTitles;
  else return 0;
}

const saveNotes = function(notes) {
  const dataJSON = JSON.stringify(notes);
  fs.writeFileSync("notes.json", dataJSON);
};

const loadNotes = function() {
  try {
    const dataBuffer = fs.readFileSync("notes.json");
    const dataJSON = dataBuffer.toString();
    return JSON.parse(dataJSON);
  } catch (e) {
    return [];
  }
};
////////////////////////////

//LOGICAL///////////////////
async function modeSelect(err) {
  const prompt = new Select({
    name: "mode",
    message: "Please select mode",
    choices: [
      "Add note",
      "Get note by title",
      "Get all notes",
      "Delete note by title",
      "Delete all notes",
      "Edit note by title",
      "Exit"
    ]
  });

  prompt
    .run()
    .then(answer => {
      usr_choise = answer;
      if (!err) notesLogic(usr_choise);
    })
    .catch(console.error);
}

function notesLogic(choise) {
  switch (choise) {
    case "Add note":
      promptNotes();
      break;
    case "Get note by title":
      selectGetTitle();
      break;
    case "Get all notes":
      getAllNotes();
      break;
    case "Delete note by title":
      selectDeleteTitle();
      break;
    case "Delete all notes":
      deleteAllNotes();
      break;
    case "Edit note by title":
      selectEditTitle();
      break;
    case "Exit":
      console.log(goodBye);
      break;
    default:
      console.log(logError);
  }
}
////////////////////////////

modeSelect();
