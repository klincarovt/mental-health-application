$(document).ready(function () {
 
  function handleRoute() {
    if (location.hash == ("")) {
      $(".logoutnav").css('display', "none");
      $(".signupnav").css('display', "block");
      $(".aborder4").css('display', "in-block");
      $(".dropdown").css('display', "in-block");
      $(".frontpage").css('display', "block");
      $(".frontimg").css('display', "block");
      $(".akademii").css('display', "none");
      $(".prostorzanastani").css('display', "none");
      $(".spaceblog").css('display', "none");
      $(".nastani").css('display', "none");
    }
    else if (location.hash.includes("#akademii")) {
      $(".aborder4").css('display', "inline-block");
      $(".dropdown").css('display', "inline-block");
      $(".logoutnav").css('display', "none");
      $(".signupnav").css('display', "none");
      $(".frontpage").css('display', "none");
      $(".frontimg").css('display', "none");
      $(".akademii").css('display', "block");
      $(".spaceblog").css('display', "none");
      $(".prostorzanastani").css('display', "none");
      $(".nastani").css('display', "none");
    }
    else if (location.hash == ("#prostorzanastani")) {
      $(".aborder4").css('display', "inline-block");
      $(".dropdown").css('display', "none");
      $(".logoutnav").css('display', "none");
      $(".signupnav").css('display', "block");
      $(".frontpage").css('display', "none");
      $(".frontimg").css('display', "none");
      $(".akademii").css('display', "none");
      $(".prostorzanastani").css('display', "block");
      $(".spaceblog").css('display', "none");
      $(".nastani").css('display', "none");
    }
    else if (location.hash == ("#spaceblog")) {
      $(".logoutnav").css('display', "none");
      $(".dropdown").css('display', "inline-block");
      $(".signupnav").css('display', "none");
      $(".frontpage").css('display', "none");
      $(".frontimg").css('display', "none");
      $(".akademii").css('display', "none");
      $(".prostorzanastani").css('display', "none");
      $(".spaceblog").css('display', "block");
      $(".nastani").css('display', "none");
    }
    else if (location.hash == ("#nastani")) {
      $(".dropdown").css('display', "inline-block");
      $(".frontpage").css('display', "none");
      $(".frontimg").css('display', "none");
      $(".akademii").css('display', "none");
      $(".prostorzanastani").css('display', "none");
      $(".nastani").css('display', "block");
      $(".spaceblog").css('display', "none");
      $(".aborder").css('borderBottom', "none");
      $(".signupnav").css('display', "none");
      $(".logoutnav").css('display', "block");
    }
  }
  


window.addEventListener("hashchange", handleRoute);
window.addEventListener("load", handleRoute);





  // --------------------------------------------------------------
  // CHART
  // --------------------------------------------------------------
  google.charts.load("current", {packages:["corechart"]});
  google.charts.setOnLoadCallback(() => drawChart(GetTasksDT()));

  let  dailyEnjoyment = [];
  const modalBtn = document.getElementById('btn-modal-stats');
  const clickmeBtn = document.getElementById('click_me');
  const dailyTaskNameEl = document.getElementById('item_name');
  const dailyTaskHourEl = document.getElementById('item_value');
  const charEl = document.getElementById('piechart_3d');


  const defaultTasks = [
    ['resting', 2],
    ['exercise', 1],
    ['sleep', 8]
  ];
  let DailyTasks = [...defaultTasks];
  let StarResult = 0;
  let CheckboxDaily = 0;
  const CreateDailyTask = (name, hours) => ([ name, hours ]);

  let DailyTasksChartOptions = {
      title: 'My Daily Activities',
      is3D: true,
  };

  function GetTasksDT() {
    const DailyTasksTable = [
      ['Tasks', 'Hours Per Day'],
    ];

    DailyTasks.forEach(task => {
      DailyTasksTable.push(task);
    });

    return google.visualization.arrayToDataTable(DailyTasksTable);
  }

  function drawChart(DT) {
    var chart = new google.visualization.PieChart(charEl);
    chart.draw(DT, DailyTasksChartOptions);
  }

  clickmeBtn.addEventListener('mousedown', () => {
    const name = dailyTaskNameEl.value;
    const hour = Number(dailyTaskHourEl.value);

    const dailyTasksHour = DailyTasks.reduce((last, curr) => {
      return last + curr[1]
    }, 0);

    if (dailyTasksHour + hour > 24)
    {
      alert('A day cannot exceed 24 hours');
      return;
    }

    DailyTasks.push(CreateDailyTask(name, hour));
    drawChart(GetTasksDT());
  });

  // --------------------------------------------------------------
  // STARS
  // --------------------------------------------------------------
  const allStars = document.querySelectorAll('label.star');

  allStars.forEach(starEl => {
    starEl.addEventListener('mousedown', () => {
      const starIdNum = starEl.htmlFor;
      const starId = Number(starIdNum[starIdNum.length-1]);
      StarResult = starId;
    });
  });

  // --------------------------------------------------------------
  // DailyRoutineCheckbox
  // --------------------------------------------------------------


  const drCheckbox = document.querySelectorAll('label.labela');

  function fetchDRCheckboxData()
  {
    let count = 0;
    drCheckbox.forEach(innerLabel => {
      const inputEl = document.getElementById(innerLabel.htmlFor);
      if (inputEl.checked)
      {
        count++;
      }
    });
    CheckboxDaily = count;
    return CheckboxDaily;
  }

  modalBtn.addEventListener('mousedown', () => {
    fetchDRCheckboxData();

    const enjoyment = dailyEnjoyment.length; 
    let moreThanSleep = 0;
    let taskCluster = 0;
    let taskPenality = 0;
    let hourCount = 0;
    DailyTasks
      .forEach(task => {
        if (task[0] != "sleep" && task[0] != "exercise" && task[0] != "sleep")
        {
          if (task[1] > 8)
          { 
            moreThanSleep++;
          }
          if (task[1] >= 1 && task[1] <= 3)
          {
            taskCluster++;
          }
        }
        hourCount += task[1];
      });

    if (taskCluster > 5)
    {
      taskPenality = taskCluster * 5;
    }
    let win = (CheckboxDaily * 10 + StarResult * 5 + enjoyment * 3);
    let loss = (moreThanSleep * 50 + taskPenality + (24 - hourCount)*3);
    let result = win - loss;
    let k = win/loss;
    let final = Math.round((result / win)*4);
    console.log(final);
    let translated = Math.round((result / win) * 10);
    let src = '';
    if (final <= 0)
    {
      src = 'images/red.jpg';
      translated = 0;
    } else if (final > 0 && final <= 2)
    {
      src = 'images/yellow.jpg';
    } else
    {
      src = 'images/green.jpg';
    }

    var html = [
      '<div class="stat-image">',
      '<img src=' + src + '>',
      '</div>'
    ].join('\n');

    document.getElementById("image-result").innerHTML = html;
    
    const str = "Based on your done tasks today and how you are feeling you got: " + translated + " out of 10";
    document.getElementById('stat-text').innerHTML = str;
    console.log(result, win, loss);
  });


// getting all required elements
const inputBox = document.querySelector(".inputField input");
const addBtn = document.querySelector(".inputField button");
const todoList = document.querySelector(".todoList");
const deleteAllBtn = document.querySelector("#clearAll");

// onkeyup event
inputBox.onkeyup = ()=>{
  let userEnteredValue = inputBox.value; //getting user entered value
  if(userEnteredValue.trim() != 0){ //if the user value isn't only spaces
    addBtn.classList.add("active"); //active the add button
  }else{
    addBtn.classList.remove("active"); //unactive the add button
  }
}

showTasks(); //calling showTask function

addBtn.onclick = ()=>{ //when user click on plus icon button
  let userEnteredValue = inputBox.value; //getting input field value
  dailyEnjoyment.push(userEnteredValue); //pushing or adding new value in array
  if (dailyEnjoyment.length + 1 > 10)
  {
    alert('You have exceed the daily limit!');
    return;
  }
  showTasks(); //calling showTask function
  addBtn.classList.remove("active"); //unactive the add button once the task added
}

function showTasks(){
  let newLiTag = "";
  dailyEnjoyment.forEach((element, index) => {
    newLiTag += `<li>${element}</i></span></li>`;
  });
  todoList.innerHTML = newLiTag; //adding new li tag inside ul tag
  inputBox.value = ""; //once task added leave the input field blank
}

// delete task function

// delete all tasks function
deleteAllBtn.onclick = ()=>{
  dailyEnjoyment = []; //empty the array
  showTasks(); //call the showTasks function
  console.log ('clear')
}

  //karticki za homepage
  var mokData = [{
    category: "Bullying",
    id: '1',
    name: 'The Centers for Disease Control defines bullying as a form of “youth violence” toward a victim involving unwanted aggressive behavior from a bully (an individual or a group). At the heart of bullying is a power imbalance—whether perceived or actual—of social status, wealth, physical strength or size. Bullying can be repeated over periods of time, resulting in physical, psychological, social or educational harm.',
    image: 'bullying3.jpg',
    link: 'https://bestdaypsych.com/the-effects-of-bullying-on-mental-health/'
  },
  {
    category: "Traumatic Events",
    id: '2',
    name: 'A traumatic event is a shocking, scary, or dangerous experience that can affect someone emotionally and physically. Experiences like natural disasters (such as hurricanes, earthquakes, and floods), acts of violence (such as assault, abuse, terrorist attacks, and mass shootings), as well as car crashes and other accidents can all be traumatic. Researchers are investigating the factors that help people cope or that increase their risk for other physical or mental health problems following a traumatic event.',
    image: 'coping.png',
    link: 'https://www.nimh.nih.gov/health/topics/coping-with-traumatic-events"'
  },
  {
    category: "Identity",
    id: '3',
    name: 'Developing a sense of self or an identity is an essential part of every individual becoming mature. Identity or parts of identity may be classified by any number of things such as religion, gender, or ethnicity. Some traits, such as race, are set at birth. Some traits may be modified later in life such as language(s) spoken or religious preferences. Struggling with various parts of identity is natural and normal. Developing an identity or sense of self and those traits a person desires to have can take time and may be challenging. Not having a strong sense of self or struggling with identity issues may lead to anxiety and insecurity.',
    image: 'identity.jpg',
    link: 'https://www.goodtherapy.org/learn-about-therapy/issues/identity-issues'
  },
      {
      category: "Borderline Personality Disorder",
      id: '4',
      name: 'Borderline personality disorder is an illness marked by an ongoing pattern of varying moods, self-image, and behavior. These symptoms often result in impulsive actions and problems in relationships. People with borderline personality disorder may experience intense episodes of anger, depression, and anxiety that can last from a few hours to days.',
      image: 'issues2.jpg',
      link: 'https://www.nimh.nih.gov/health/topics/borderline-personality-disorder' 
    },
    {
      category: "Mental Wellbeing",
      id: '5',
      name: 'Your mental wellbeing is about your thoughts and feelings and how you cope with the ups and downs of everyday life. Its not the same thing as mental health, although the two can influence each other. Long periods of low mental wellbeing can lead to the development of diagnosable mental health conditions such as anxiety or depression. If you are living with a mental health condition, you may experience low mental wellbeing more often, but there will also be long periods where you are able to maintain good mental wellbeing.',
      image: 'wellbeing.jpg',
      link: 'https://www.caba.org.uk/help-and-guides/information/what-mental-wellbeing#:~:text=Share,two%20can%20influence%20each%20other.' 
    },
    {
      category: "Relationships",
      id: '6',
      name: 'Being happily married or in a stable relationship impacts positively on mental health. Research has found that high marital quality is associated with lower stress and less depression. However, single people have better mental health outcomes than people who are unhappily married.',
      image: 'relationships.jpg',
      link: 'https://www.mentalhealth.org.uk/statistics/mental-health-statistics-relationships-and-community#:~:text=Couple%20relationships,people%20who%20are%20unhappily%20married.' 
    },
  ];
  $.each(mokData, function (i) {
    var templateString =
      '<div class="col-sm-6 col-md-4 card-holder design cardpop"><a href="'+ mokData[i].link +'" style="text-decoration: none;"  class="thumbnail"><img class="zanasimg"src="images/Za_Nas/' + mokData[i].image + '"><div class="caption"><h3><strong>' + mokData[i].category + '</strong></h3><h5>' + mokData[i].name + '</h5><p class="farp"><i class="far fa-arrow-alt-circle-right" style="font-size:60px;"></i></p></div></a></div>';
    $('.cards1').append(templateString);
  })

    var mokData2 = [{
      category: "Get Immediate Help",
      id: '1',
      name: 'People often dont get the mental health services they need because they dont know where to start. Talk to your primary care doctor or another health professional about mental health problems. Ask them to connect you with the right mental health services. If you do not have a health professional who is able to assist you, use these resources to find help for yourself, your friends, your family, or your students.',
      image: 'help2.png',
      link: 'https://www.mentalhealth.gov/get-help/immediate-help'
    },
    {
      category: "Health Insurance and Mental Health Services",
      id: '2',
      name: 'As of 2014, most individual and small group health insurance plans, including plans sold on the Marketplace are required to cover mental health and substance use disorder services. Medicaid Alternative Benefit Plans also must cover mental health and substance use disorder services.',
      image: 'insurance.png',
      link: 'https://www.mentalhealth.gov/get-help/health-insurance'
    },
    {
      category: "Participate in a Clinical Trial",
      id: '3',
      name: 'The National Institute of Mental Health supports research studies on mental health problems. Clinical trials are scientific studies to find better ways to prevent, detect, or treat illnesses.',
      image: 'clinical.jpg',
      link: 'https://www.nimh.nih.gov/health/trials'
    },
  ];
  $.each(mokData2, function (i) {
    var templateString =
      '<div class="col-sm-6 col-md-4 card-holder design cardpop"><a href="'+ mokData2[i].link +'" style="text-decoration: none;"  class="thumbnail"><img style="min-height: 280px";"; class="zanasimg"src="images/Nastani/' + mokData2[i].image + '"><div class="caption"><h3><strong>' + mokData2[i].category + '</strong></h3><h5>' + mokData2[i].name + '</h5><p class="farp"><i class="far fa-arrow-alt-circle-right" style="font-size:60px;"></i></p></div></a></div>';
    $('.cards3').append(templateString);
  })

//buttons change
$(function () {
  $("li").click(function() {
    $(".aborder").css('border-bottom', "solid 2px yellow");  
  });
});
$(function () {
  $(".edubutton").click(function() {
    $("#companyimg").attr("src", "images/Za_Nas/whatis.jpg");
    $(this).css('backgroundColor', "black");
    $(this).css('color', "rgb(234, 195, 46)");
    $(".companybutton").css('backgroundColor', "rgb(234, 195, 46)");
    $(".companybutton").css('color', "black");
  });
});
$(function () {
  $(".companybutton").click(function() {
    $("#companyimg").attr("src", "images/Za_Nas/whatis2.png");
    $(this).css('backgroundColor', "black");
    $(this).css('color', "rgb(234, 195, 46)");
    $(".edubutton").css('backgroundColor', "rgb(234, 195, 46)");
    $(".edubutton").css('color', "black");
  });
});



    $(".reservespot").click(function(){
      var popup = document.getElementById("myPopup");
      popup.classList.toggle("show");
      setTimeout(function() { popup.classList.toggle("show"); }, 3000);
    }) 
    



// card animate
$('.thumbnail').hover(
  function(){
    $(this).animate({
      marginTop: "-=1%",
    },200);
  },
  function(){
    $(this).animate({
      marginTop: "0%"
    },200);
  }
);

//modals
$('#myModal').on('shown.bs.modal', function () {
  $('button1').focus()
})

$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

})
