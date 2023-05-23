# Community-Comm

- A Chrome browser extension that passively monitors the user's behavior and guide's their news-browsinfg experience through several interventions.
- Provides bias information about news sources *in-situ*
- Aggregates and displays personal consumption data
- Allows to user to submit their own annotations of a news source as a means of crowdsourcing data

## Features

#### **Personal Informatics Tool**

- When visiting a news source, a dropdown ribbon will be injected to the top of the webpage that displays information surrounding the user's news-browsing. 
- Displays the basic information of the current news source, the dominant political bias of the users based on current and previous news sources with chart and the user session information. 
- The article information includes news source, current news bias and its title. 
- The bias information display and calculate based on user's read news and decide it by allside bias standard.
- The user session information shows number of news read, average news reading time, current spending time for news and how many times user click or scroll of current news. 

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
