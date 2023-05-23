# Empowered Readers: : A Usability Study on Examining the Effectiveness of a Personal Informatics Tool in Enhancing Readers’ Experience and Mitigating the Spread of Misinformation
Prerana Khatiwada, Haritha Varkala, Dileep Reddy Nimma, Yongho Cho

abstract
In the digital age, the prevalence of fake news poses a significant challenge in society, with misinformation rapidly spreading online. Furthermore, individuals encounter personalized and fragmented news consumption due to various available sources and platforms, leading to information overload and decision paralysis. To address this issue, effective interventions are needed to aid users in identifying and avoiding false information. However, the impact of technological interventions on readers’ perception and understanding of news content remains uncertain. This study aims to investigate the effectiveness of a personal informatics tool in assisting users in managing their news consumption and making informed decisions.
Our usability study with 10 participants uses a between-subjects design. It measures various aspects of participants’ sessions, including reading time, the number of articles reads, dominant bias percentages, click-through rates, scrolling speed, the accuracy of responses, ease of use of the dashboard, and more. The tool’s visual representations of article sources and bias ratings helped assess information trustworthiness. Participants reported increased confidence in identifying false information, with higher accuracy in distinguishing reliable from unreliable articles. Our findings support the hypothesis that using personal informatics tools while reading news articles can result in more efficient navigation and higher engagement with the content. However, these results also suggest that the personal informatics tool may decrease reading time. The intervention significantly enhanced participants’ awareness and confidence in discerning bias and unsupported claims in news articles. It positively influenced participants’ ability to identify inflammatory language and biases within news articles.

# Personal Informatics Tool

- A Chrome browser extension that passively monitors the user's behavior and guide's their news-browsinfg experience through several interventions.
- Provides basic article information and its bias information about news sources *in-situ*
- If a news article has false, misreading, or disturbing information, a pop-up guides users
- Aggregates and displays personal consumption and action data on web pages

## Features

- When visiting a news source, a dropdown ribbon will be injected to the top of the webpage that displays information surrounding the user's news-browsing. 
- Displays the basic information of the current news source, the dominant political bias of the users based on current and previous news sources with chart and the user session information. 
- The article information includes news source, current news bias and its title. 
- The bias information display and calculate based on user's read news and decide it by allside bias standard.
- The user session information shows number of news read, average news reading time, current spending time for news and how many times user click or scroll of current news. 
- When accessing an article which has fake, misleading or disturbing information, a pop-up stop displaying the website and shows a warning message. User needs to click ok button 

#### **Firebase Backend**

- Our Chrome plugin communicates with a Firebase Realtime Database to send and retrieve various data:
    #### <u>User Log</u>

    - Every user is assigned a unique id so no data we collect can be tied their identity
    - For each user, we collect:
        1. Every website they visit
        2. The length of time that they are actively viewing the website
        3. The URL of every unique news article they view (organized by day)
        4. The number of click and scroll times on the current web page

    #### <u>AllSides Bias Annotations</u>

    - A dataset of information on various news sources collected from AllSides.com
    - Each data item contains:
        1. Name of news source
        2. Domain of news source (e.g. 'www.nytimes.com')
        3. Political leaning
        4. Community feedback regarding bias rating

- The AllSides dataset may be subject to change over time. To update Firebase to reflect any new data, do the following:
    1. Store your new dataset in a .csv file under the /Data folder 
    2. Using either Python or the Command Line, make sure your working directory is `Community-Comm/Util`
    3. Execute the script `upload.py` making sure Line 18 is pointing to the correct csv file. Console output should indicate if the upload was successful or not.


## Setup
1. Clone the repository, save to a known location
2. In Chrome, visit chrome://extensions, **OR** in the top right click Extensions --> Manage Extensions
3. In the top right corner, enable developer mode
4. Click 'Load Unpacked' and select the directory 'Chrome_Plugin' (This can be found in the cloned repository).
#
