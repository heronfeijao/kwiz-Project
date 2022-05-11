/* eslint-disable no-undef */
// Client facing scripts here

$(document).ready(() => {
  let num = 1;
  let kwizData;
  let questions;
  let answers = [];
  let correct = [];

  $('#scroll-top').fadeOut();

  $(document).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $('#scroll-top').fadeIn();
    } else {
      $('#scroll-top').fadeOut();
    }
  });

  $('#scroll-top').on('click', () => {
    $(document).scrollTop(0);
  });

  //append login page
  $(document).on('click', '#login', (e) => {
    e.preventDefault();
    $('.container').empty().append(loginPage());
  });

  //logout and refresh
  $(document).on('click', '#logout', (e) => {
    e.preventDefault();
    logOut()
      .then(() => {
        window.location.href = '/';
      });
  });

  //append register page
  $(document).on('click', '#register', (e) => {
    e.preventDefault();
    $('.container').empty().append(registerPage());
  });

  //append a new question block
  $(document).on('click', '#newquestion', (e) => {
    e.preventDefault();
    num++;
    $('#questionscontainer').append(question(num)).html();
  });

  //delete the latest question block
  $(document).on('click', '#deletequestion', (e) => {
    e.preventDefault();
    if (num === 1) {
      alert('You must have at least one question!');
    } else {
      $(`#question${num}`).remove();
      num--;
    }
  });

  //create a quiz
  $(document).on('submit', '#createkwizform', function (e) {
    e.preventDefault();
    const data = $(this).serialize();
    let submit = true;
    $('.formfield').each(function () {
      if ($(this).val() === '') {
        alert('You did not fill out one of the fields!');
        submit = false;
        return false;
      }
    });
    if (submit) {
      //inject createKwiz;
      createKwiz(data)
        .then(() => {
          n = 0;
          location.href = '/publickwizes';
        });
    }
  });

  //submit login form
  $(document).on('submit', '#login-form', function (e) {
    e.preventDefault();

    const data = $(this).serialize();
    logIn(data)
      .then((data) => {
        if (data === "WRONG INFO") {
          alert('Wrong password!');
          // $('.container').append("AAAAAAAAAAA").html();// ADD ERROR MESSAGE (SHOW)
          // console.log("WRONG INFOOOOOOOOOOOOOOOOOOOO");
          return;
        }
        location.reload();
      });
  });

  //submit register form
  $(document).on('submit', '#register-form', function (e) {
    e.preventDefault();

    const data = $(this).serialize();
    signUp(data)
      //.then(getMyDetails)
      .then((data) => {
        if (data === "EXIST") {
          alert('This user already exists!');
          // $('.container').append("AAAAAAAAAAA").html();// ADD ERROR MESSAGE (SHOW)
          // console.log("EXISTTTTTTTTTT");
          return;
        }
        window.location.href = '/publickwizes';
      });
  });

  //start the quiz
  $(document).on('click', '.kwizbutton', function (e) {
    e.preventDefault();
    getKwiz(`${$(this).attr('href')}`)
      .then((data) => {
        kwizData = data;
        kwizId = Object.keys(kwizData)[0];
        questions = Object.keys(kwizData[kwizId]);
        qnum = 0;
        $('#questions').empty().append(kwizQuestion(kwizData, kwizId, questions[qnum]));
        if (qnum === questions.length - 1) {
          $('#questions').append(submitKwizButton());
        } else {
          $('#questions').append(nextQuestionButton());
        }
        qnum++;
      });
  });

  //HELPER FUNCTIONS
  const correctAnswer = (answer, correct) => {
    if (answer === correct) {
      return true;
    }
    return false;
  };

  const getKey = (obj, value) => {
    return Object.keys(obj).find(key => obj[key] === value);
  };

  //next question
  $(document).on('click', '#nextbutton', function (e) {
    e.preventDefault();
    const correctAns = kwizData[kwizId][qnum].qans;
    console.log("correctAns", correctAns);
    const answer = getKey(kwizData[kwizId][qnum], $("input:checked").val());
    const userCorrect = correctAnswer(answer, correctAns);

    if (!$("input:radio").is(":checked")) {
      alert('Nothing is checked!');
    } else {
      if (qnum === questions.length - 1) {
        correct.push(userCorrect);
        answers.push(answer);
        $('#questions').empty().append(kwizQuestion(kwizData, kwizId, questions[qnum])).append(submitKwizButton());
      } else {
        correct.push(userCorrect);
        answers.push(answer);
        $('#questions').empty().append(kwizQuestion(kwizData, kwizId, questions[qnum])).append(nextQuestionButton());
      }
      qnum++;
    }
  });

  //submit the quiz and get the result
  $(document).on('submit', '#questions-form', function (e) {
    e.preventDefault();
    const correctAns = kwizData[kwizId][qnum].qans;
    const answer = getKey(kwizData[kwizId][qnum], $("input:checked").val());
    const userCorrect = correctAnswer(answer, correctAns);
    correct.push(userCorrect);
    answers.push(answer);
    const results = { kwizId, answers, correct };
    console.log("results", results);
    generateResult(results)
      .then(() => {
   
      });

    // $.post('/results', results)
    //   .then(() => {
    //     window.location.href = '/results';
    //   });
  });

  //copy link

  const copyToClipboard = function (text) {
    const $temp = $("<input>");
    $("body").append($temp);
    $temp.val(text).select();
    document.execCommand("copy");
    $temp.remove();
  };

  $(document).on('click', '#sharebutton', function (e) {
    e.preventDefault();

    const $link = $(this).siblings().attr('href');
    copyToClipboard(`${window.location.origin}${$link}`);

    const $share = $(this).closest("div").nextAll("div[id]:first");
    $share.text('Copied to the clipboard!').addClass('text-center');
    $share.slideDown();
    setTimeout(() => {
      $share.slideUp();
    }, 5000);
  });



  // ERD => id, user_id = null, q#, user_answer, correct_answer


});
