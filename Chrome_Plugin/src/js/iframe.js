console.log("iframe.js is ACTIVE");

var scroll_count = 0;
var click_count = 0;
var article_title = '';
let user_id, url;
let aricle_id = '';
let r_domain,r_leaning, r_avgTime, r_sessionTime, r_articleCnt, r_dbias;

var firebaseConfig = {
    apiKey: "AIzaSyCQsWrA1_zCAukNqv3qOUBYXY7KBudFRjQ",
    authDomain: "cisc475database.firebaseapp.com",
    databaseURL: "https://cisc475database-default-rtdb.firebaseio.com",
    projectId: "cisc475database",
    storageBucket: "cisc475database.appspot.com",
    messagingSenderId: "372963635946",
    appId: "1:372963635946:web:7ed6c09fce9f9bff8d1d93",
    measurementId: "G-JZ5HT65P6V"
};

// Initialize Firebase --> I wonder if we can do this in a shared file? 
const app = firebase.initializeApp(firebaseConfig);

// The query string is the set of characters that come after ? in a URL. We use this to pass data to our frame. 
const queryString = window.location.search;
//console.log("iframe.js queryString : ",queryString);

// Copied from background.js
// Soon we should be able to import these from a shared resources.js file.
const getDomain = (url) => {
    let newURL = url.toString();
    arr = newURL.split('/');
    return arr[2];
};
const processDate = () => {
    // Separates timestamps into date and time. We can delete if necessary
    splitDate = Date().split(' ');
    timestamp = {
        date:`${splitDate[0]} ${splitDate[1]} ${splitDate[2]} ${splitDate[3]}`,
        time:`${splitDate[4]} ${splitDate[5]} ${splitDate[6]}`,
        full: Date()
    };
    return timestamp;
};

Date.prototype.Format = (fmt) => {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

//Bring a chart place in canvas
const ctx = document.querySelector('#myChart').getContext('2d');

//Initialization labels and data for chart.
let labels = [],
    data = [];
//Creating Chart with Chart.js
const chart = new Chart(ctx, {
    type: 'doughnut', //Shape of chart     
    data: {
        //Labels for bias
        labels: ['Left', 'Left-Center', 'Undefined', 'Right-Center', 'Right', 'Center'],
        datasets: [{
            labels,
            data,
            backgroundColor: ['Red', 'Orange', 'Grey', 'Cyan', 'Blue', 'Purple'], //Each color of labels
            borderColor: '#fff',
            borderWidth: 1
        }]
    },
    options: {
		responsive: false, //Set the chart to resize automatically
		maintainAspectRatio: false, 
        //Set chart animaztion effect
        animation: {
			animateRotate: true, 
            duration: 2000, 
            easing: 'ease-in-out' //Set the rate of change of the animation
        },
        scales: {
            y: {
                display: false, //Set y-axis mark 
				ticks: {
					display: false, //Set the rate of change of the animation				},
                },
            },
        },
        plugins: {
            // legend: {
            //     position: 'bottom', // Set place of legends
            //     labels: {
            //         fontColor: '#000', // Legends font color
            //         fontSize: 14 // Legends font size
            //     }
            // },
            // title: {
            //     display: true,
            //     text: 'NEW CHART'
            // },
                legend: {
                    display : false
                },
        }
    }
});

//Get data from ribbon.js
let searchParams = new URLSearchParams(queryString);
//console.log(searchParams.get("srcid"));

if(searchParams.has("srcid") && searchParams.has("uid")){

    const domain = getDomain(searchParams.get("srcid")).replaceAll('.', ' ');
    
    const userid = searchParams.get("uid");
    const biasCnt = searchParams.get("count");
    const leaning = searchParams.get("bias");
    const avgTime = searchParams.get("time");

    const articleCnt = searchParams.get("count");
    const LbiasCnt = searchParams.get("lcnt");
    const LCiasCnt = searchParams.get("lccnt");
    const UnCnt = searchParams.get("ucnt");
    const RCbiasCnt = searchParams.get("rccnt");
    const RbiasCnt = searchParams.get("rcnt");
    const Comleaning = searchParams.get("leaning");
    //05.04.2023 Dominant bias
    const dbias = searchParams.get("dbias");
    const CenCnt = searchParams.get("ccnt");

    //04.26.2023 Url 
    user_id = userid;
    url = searchParams.get("srcid");

    firebase.database().ref("bias_annotations_allsides/" + domain).on('value', (snapshot) => {
        data = snapshot.val();
    });

    d3.select(".bias").text(leaning);
    r_leaning = leaning;

    d3.select(".dbias").text(dbias);
    r_dbias = dbias;

    //TODO: implement stronger way to render name of source ( not just domain.split(" ")[1] )
    //05.06.2023 fix source extract from domain (ex> if the url has not www than it shows just 'co' or '.com')
    if (domain.split(" ")[0]==="www"){
        r_domain = domain.split(" ")[1];
        d3.select(".source").text(domain.split(" ")[1]);
    } else {
        r_domain = domain.split(" ")[0];
        d3.select(".source").text(domain.split(" ")[0]);
    }

    //04.28.2023 averge reading time
    d3.select(".time").text(Math.floor(avgTime));
    r_avgTime = avgTime;
    //04.24.2023 scroll time
    d3.select(".stime").text(scroll_count/10);

    //04.28.2023 statics informtations(number of read articles and leaning percentage)
    d3.select(".numArticles").text(articleCnt);
    r_articleCnt = articleCnt;
    d3.select(".Leanings").text(Math.floor(Comleaning));

    //Put data for chart
    chart.data.datasets[0].data[0] = LbiasCnt; 
    chart.data.datasets[0].data[1] = LCiasCnt; 
    chart.data.datasets[0].data[2] = UnCnt; 
    chart.data.datasets[0].data[3] = RCbiasCnt; 
    chart.data.datasets[0].data[4] = RbiasCnt; 
    chart.data.datasets[0].data[5] = CenCnt; 
    chart.update(); 
};

//Manage and control articles
//articles data 
// const list_articles = [
//     'https://www.cnn.com/2023/04/19/sport/anthony-bass-blue-jays-airplane-intl-spt/index.htmlbbb1',
//     'https://www.foxnews.com/politics/afghanistan-ig-report-hammers-biden-administration-dysfunction-days-white-house-blames-trumpbbb1',
//     'https://abcnews.go.com/US/fox-settlement-big-step-democracy-dominion-ceo/story?id=98687463bbb1',
//     'https://www.bbc.com/news/world-us-canada-65328736bbb1',
//     'https://www.nbcnews.com/news/us-news/two-boys-17-16-arrested-connection-deadly-shooting-alabama-sweet-16-rcna80404bbb1',
//     'https://apnews.com/article/sudan-fighting-ceasefire-civilians-generals-0ba6dee91ad24fa8fad80a12564fd5c3bbb0',
//     'https://www.atlasnetwork.org/articles/tennessee-aims-to-be-the-u-s-innovation-capitalbbb0',
//     'https://www.bloomberg.com/news/articles/2023-04-19/tesla-drops-model-3-model-y-prices-on-eve-of-quarterly-earnings?srnd=premium&leadSource=uverify%20wallbbb0',
//     'https://www.bgdailynews.com/news/sentencing-delayed-for-man-caught-in-jewelry-heist-scheme/article_ce63b323-a450-5ee4-a1d6-93d52923230b.htmlbbb0',
//     'https://www.buzzfeednews.com/article/stephaniesoteriou/leonardo-dicaprio-kate-winslet-friendship-timelinebbb0',
//     'https://www2.cbn.com/news/us/inside-dr-charles-stanleys-life-and-legacy-bible-verse-drove-his-decades-long-ministrybbb0',
//     'https://chicago.suntimes.com/2023/4/18/23663877/moons-sandwich-shop-chicago-90th-birthday-restaurants-delicatessanbbb0',
//     'https://www.nytimes.com/2023/04/19/world/asia/india-china-population.htmlbbb0',
//     'https://www.washingtonpost.com/world/2023/04/18/china-supersonic-drone-taiwan-leaks/bbb0'
// ];
//05.04.2023 added by Prerana
// const list_articles = [
//     'https://www.nbcnews.com/news/us-news/texas-shooting-suspect-captured-after-manhunt-rcna82214bbb1',
//     'https://dailycaller.com/2023/05/03/jordan-neely-death-ruled-homicide-chokehold-subway-train-nyc/bbb1',
//     'https://www.theguardian.com/music/2023/may/01/ed-sheeran-copyright-trial-marvin-gayebbb1',
//     'https://www.kron4.com/news/bay-area/security-guard-accused-of-killing-man-at-sf-walgreens-will-not-be-charged-with-murder-da-says/bbb1',
//     'https://apnews.com/article/cleveland-texas-shooting-vigil-suspect-missing-8fce1ef4c0cdb8581f8820d1f1f917f2bbb1',
//     'https://www.cnn.com/2023/04/30/opinions/biden-jokes-age-correspondents-dinner-obeidallah/bbb0',
//     'https://www.react365.com/59d70d31e2b67/devastating-snowfall-predicted-for-nw-montana-in-early-2018.htmlbbb0',
//     'https://www.newyorker.com/news/news-desk/el-chapo-escapes-againbbb0',
//     'https://hollywoodgazette.com/obama-signs-executive-order-banning-sale-of-assault-weapons/bbb0',
//     'https://mousetrapnews.com/breaking-disney-world-officially-moving-to-new-orleans/bbb0',
//     'https://www.usatoday.com/story/money/nation-now/2017/01/12/does-nutella-cause-cancer-maker-fights-back-palm-oil-cancer-concerns/96481194/bbb0',
//     'https://www.bbc.com/news/health-34615621bbb0',
//     'https://www.vox.com/2015/8/20/9179217/paleo-diet-jeb-bush-weight-lossbbb0'
// ];
const list_articles = [
    'https://www.nbcnews.com/news/us-news/texas-shooting-suspect-captured-after-manhunt-rcna82214/uid=A23',
    'https://dailycaller.com/2023/05/03/jordan-neely-death-ruled-homicide-chokehold-subway-train-nyc/uid=A47',
    'https://www.theguardian.com/music/2023/may/01/ed-sheeran-copyright-trial-marvin-gaye/uid=A19',
    'https://apnews.com/article/cleveland-texas-shooting-vigil-suspect-missing-8fce1ef4c0cdb8581f8820d1f1f917f2/uid=A34',
    'https://apnews.com/article/youtuber-shot-tanner-cook-mall-a215712ddbf06b96be62b0e3a6be2047?utm_source=ForYou&utm_medium=HomePage&utm_id=Taboola/uid=A50',
    'https://www.cbsnews.com/news/national-park-service-warning-death-valley-california-woman-bitten-bat-with-rabies/uid=A13',
    'https://www.newyorker.com/news/news-desk/el-chapo-escapes-again/uid=A79',
    'https://www.dailywire.com/news/la-writer-brought-maga-hat-vegan-restaurant-heres-paul-bois/uid=A7',
    'https://www.theonion.com/lucrative-new-oil-extraction-method-involves-drilling-d-1819577490/uid=A44',
    'https://www.vanityfair.com/style/2018/06/joe-jackson-obituary/uid=A81',
];


var startTime = window.performance.now();
var sessionTimeContainer = d3.select(".session_time_value");

setInterval(function () {
  var currentTime = window.performance.now();
  var sessionTime = Math.floor((currentTime - startTime) / 1000); // convert milliseconds to seconds

  var hours = Math.floor(sessionTime / 3600);
  var minutes = Math.floor((sessionTime % 3600) / 60);
  var seconds = sessionTime % 60;

  // Format the time values as two digits
  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;

  var displayTime = '';

  if (hours > 0) {
    displayTime += hours + ' Hrs: ';
  }
  if (hours > 0 || minutes > 0) {
    displayTime += minutes + ' Mins: ';
  }
  displayTime += seconds + ' Secs';

  sessionTimeContainer.text(displayTime);
  r_sessionTime = displayTime;
}, 1000);

const currentUrl = window.location.href;
const url_param = new URL(currentUrl);
const srcid = url_param.searchParams.get("srcid");

function showAlert(message) {

    return new Promise((resolve) => {
        alert(message);
        resolve();
    });
}

async function warning_comment(uniqueId) {

    var misleading_alert = 'The headlines in this article are misleading. Press OK button to continue loading this article.';
    var disturbing_alert = 'This article contains images or descriptions that may be disturbing or unsettling for some readers. Press OK button to continue loading this article.';
    var fake_alert = 'The news in this article might not be true. Press OK button to continue loading this article.';
    var Survey_alert = 'If you did not take the survey for the previous article. Please proceed to the other monitor to take the survey.';
    
    
    await alert(Survey_alert);

    if (uniqueId == 'A79' || uniqueId == 'A7' || uniqueId == 'A81') {
        await showAlert(fake_alert);
    } else if (uniqueId == 'A44') {
        await showAlert(misleading_alert);
    } else if (uniqueId == 'A47') {
        await showAlert(disturbing_alert);
    }
}

function finishFunction() {
    sendSessionData();
    window.open('https://delaware.ca1.qualtrics.com/jfe/form/SV_5irmSYoNvV3o4nk', '_top');
};

//05.06.2023 for article_id
//url and const list_article compare
function setArticleID() {
    const url = window.location.href;

    for (let i = 0; i < list_articles.length; i++) {
        const articleUrl = list_articles[i].split('/uid=')[0];

        if (url.includes(articleUrl)) {
            d3.select(".article_id").text(list_articles[i].split('/uid=')[1]);
            aricle_id = list_articles[i].split('/uid=')[1];
            break;
        }
    }
}


function list_generator() {
    var container_part = document.getElementById('articles_btns');

    let currentIndex = list_articles.findIndex(article => currentUrl.includes(article.split('/uid=')[0]));
  
    for (let i = 0; i < 10; i++) {
      var article_button = document.createElement('div');
      article_button.className = 'item item' + i;
      let article = list_articles[i].split('/uid=')[0];
      let uniqueId = list_articles[i].split('/uid=')[1];
        
      //article_button.innerHTML = '<a href=\'' + article + '\' target=\'_top\' onclick=\'warning_comment("' + uniqueId + '"); setActiveArticle("' + uniqueId + '");\'>Article #' + (i + 1) + '</a>';
    article_button.innerHTML = `<a href="${article}" target="_top" onclick="warning_comment('${uniqueId}'); sendSessionData(); setActiveArticle('${uniqueId}');">Article #${i + 1}</a>`;

    if (i === currentIndex) {
        article_button.style.backgroundColor = 'red';
      }

    container_part.appendChild(article_button);
    }
    var finish_button = document.createElement('div');
    finish_button.className = 'item finish';
    finish_button.innerHTML = '<a href="#" onclick="finishFunction();">Finish</a>';
    container_part.appendChild(finish_button);

    setArticleID();

    const first_article = list_articles[0].split('/uid=')[0];
    const current_url = window.location.href;
    if (current_url.includes(first_article)) {
        alert('Welcome! Please read this article carefully and proceed to the other monitor to take the survey after you are done.')
        alert('This article contains images or descriptions that may be disturbing or unsettling for some readers. Press OK button to continue loading this article.')

    }   
  }


function isNumeric(val) {
    return /^-?\d+$/.test(val);
};
//05.06.2023 Get message from scroll.js
function receiveMessage(event){
    //In this part we can add security module for checking origin

    if(isNumeric(event.data[0])){ //scroll time

        scroll_count = event.data[0];
      d3.select(".stime").text(Math.floor(scroll_count/10));
      //sendScrollData(user_id, processDate().date, processDate().time, url, Math.floor(scroll_count));
      //Bring scroll data from database based on in a day with an uid, calculate avg of it.
      //let temp = getScrollData(user_id, processDate().date);
      //console.log("Get scroll data from db ::", temp[0]);
    };
    if(!isNumeric(event.data[1])){ //article title
        //console.log("iframe.js received post msg:", event.data);
        article_title = event.data[1];
        let full_title = article_title;
        if(article_title.length>45){
            article_title = article_title.substring(0,40);
            article_title = article_title+'...';
        }
        let article_div = d3.select(".article_title");
        article_div.text(article_title);
        article_div.attr("title", full_title);
    };
    if(isNumeric(event.data[2])){ //Number of clicks
        click_count = event.data[2];
        d3.select(".ctime").text(click_count);
    };
};
window.addEventListener("message", receiveMessage, false);

//2023.3.10 added for '#' character
const cleanURL = (url) => {
    //return url.replaceAll('.',' ').replaceAll('/', '%');
    return url.replaceAll('.',' ').replaceAll('/', '%').replaceAll('#','%23');
}

//function sendSessionData(uid, date, time, srcid, page_title, article_id, click_rate, scroll_rate) {
//05.06.2023 Send session information into DB
function sendSessionData() {    
    //  uploads user's actions 
    let id = user_id;
    let date = processDate().date;
    //artciel information part
    let url = searchParams.get("srcid");
    let db_source = r_domain;
    let db_bias = r_leaning;
    let db_page_title = article_title;
    //bias part
    let db_dbias = r_dbias;
    //user session part
    let db_articleRead = r_articleCnt;
    let db_avgreadingTime = Math.floor(r_avgTime);
    let db_readingTime = r_sessionTime;
    let db_click_rate = click_count;
    let db_scroll_rate = scroll_count;
    //article button part
    let db_article_ID = aricle_id;
    
    try {
        //need to divide db savepoint for intervention and control group
       firebase.database().ref('user_session_data_test/' + id + '/' + date + '/' + 'articles' + '/' + cleanURL(url)).set({
                source: db_source,
                current_article_bias: db_bias,
                page_title: db_page_title,
                dominant_bias: db_dbias,
                article_read: db_articleRead,
                avg_reading_time: db_avgreadingTime,
                current_reading_time: db_readingTime,
                click_rate: db_click_rate,
                scroll_rate: db_scroll_rate,
                article_id: db_article_ID
        },
        (response) => {
            //alert("Send session data success!!!");
            //console.log("iframe.js sendSessionData(): Data successfully sent to server; received response");
        }); 
    } catch (e) {
        //alert("Error in sendSessionData(): " + e);
        //console.log("Error in sendSessionData(): " + e);
    }
};

