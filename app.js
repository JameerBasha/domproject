accessToken = "f6944d386860460d8492cc7b6fde66c76d18051b";

async function request(url, method, messageBody) {
    let promise = await fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        },
        body: JSON.stringify(messageBody)
    });
    let responseValue = await promise.text();
    return responseValue;
}

async function requestIssues(req, res) {
    var username = document.getElementById("username-input").value;
    var reponame = document.getElementById("reponame-input").value;
    const url =
        "https://api.github.com/repos/" +
        username +
        "/" +
        reponame +
        "/issues?access_token=" +
        accessToken;

    let result = await request(url, "GET");
    return result;
}

function printIssues(responseObject) {
    document.getElementById("issues-container").innerHTML =
        "<div class='issue-box'><div class='issue-title'><h5 class='text-light'>Issue Title</h5></div><div class='created-on'><h5 class='text-light'>Created On Date</h5></div><div class='issue-label' id='issue-label'><h5 class='text-light'>Labels</h5></div></div>";
    var indexNumber = Object.keys(responseObject).length;
    for (let issueNumber in responseObject) {
        var newIssueBox = document.createElement("div");
        newIssueBox.setAttribute("class", "issue-box text-light");
        newIssueBox.setAttribute("id", "issue-box-number-" + indexNumber);

        var newIssueTitle = document.createElement("div");
        newIssueTitle.setAttribute("class", "issue-title");
        newIssueTitle.innerHTML =
            indexNumber + "." + responseObject[issueNumber]["title"];
        newIssueBox.appendChild(newIssueTitle);

        var newCreateDate = document.createElement("div");
        newCreateDate.setAttribute("class", "created-on text-light");
        newCreateDate.innerHTML = responseObject[issueNumber]["created_at"];
        newIssueBox.appendChild(newCreateDate);

        var newLabel = document.createElement("div");
        newLabel.setAttribute("class", "label-container");
        newLabel.setAttribute("Id", "label-container-number" + indexNumber);
        newIssueBox.appendChild(newLabel);
        document.getElementById("issues-container").appendChild(newIssueBox);
        indexNumber -= 1;
    }
}

async function getListOfLabels() {
    const url =
        "https://api.github.com/repos/jameerbasha2/samplerepo/labels?access_token=" +
        accessToken;
    let responseValue = await request(url, "GET");
    let responseObject = JSON.parse(responseValue);
    let arrayOfLabels = [];
    for (let label in responseObject) {
        arrayOfLabels.push(responseObject[label]["name"]);
    }
    return arrayOfLabels;
}

async function printLabels(responseObject) {
    var labels = [];
    var labelColor = [];
    var indexNumber = Object.keys(responseObject).length;
    var indexNumberOfLabel = 0;
    for (let issueNumber in responseObject) {
        labels.push(responseObject[issueNumber]["labels"]);
    }
    let arrayOfLabels = await getListOfLabels();
    for (let label in labels) {
        for (let individualLabel in labels[label]) {
            var spaceElement = document.createElement("span");
            spaceElement.innerHTML = "&nbsp; &nbsp";
            var newlabel = document.createElement("span");
            newlabel.setAttribute("class", "individual-label");
            newlabel.setAttribute("Id", "label-number" + indexNumberOfLabel);
            newlabel.setAttribute(
                "onclick",
                "removeLabel" + "(" + indexNumberOfLabel + "," + indexNumber + ")"
            );
            newlabel.innerHTML = labels[label][individualLabel]["name"];
            newlabel.style.background = "#" + labels[label][individualLabel]["color"];
            newlabel.style.color = "#000000";
            newlabel.style.padding = "2px";
            document
                .getElementById("label-container-number" + indexNumber)
                .appendChild(newlabel);
            document
                .getElementById("label-container-number" + indexNumber)
                .appendChild(spaceElement);
            indexNumberOfLabel += 1;
        }
        var newAddInput = document.createElement("select");

        for (let label in arrayOfLabels) {
            newAddInput.innerHTML +=
                "<option value=" +
                arrayOfLabels[label] +
                ">" +
                arrayOfLabels[label] +
                "</option>";
        }
        newAddInput.setAttribute("Id", "input-label-number-" + indexNumber);
        var newAddButton = document.createElement("button");
        newAddButton.innerHTML = "ADD LABEL";
        newAddButton.style.marginLeft = "10px";
        newAddButton.setAttribute("onclick", "addLabel(" + indexNumber + ")");
        document
            .getElementById("label-container-number" + indexNumber)
            .appendChild(newAddInput);
        document
            .getElementById("label-container-number" + indexNumber)
            .appendChild(newAddButton);
        indexNumber -= 1;
    }
}

async function removeLabel(labelIndex, issueIndex) {
    var removeLabelName = document.getElementById("label-number" + labelIndex)
        .textContent;
    console.log(removeLabelName);
    let url =
        "https://api.github.com/repos/jameerbasha2/samplerepo/issues/" +
        issueIndex +
        "/labels/" +
        removeLabelName +
        "?access_token=" +
        accessToken;
    let promise = await request(url, "DELETE");
    getIssues();
}

async function getIssues() {
    let obtainedObject = await requestIssues();
    parsedObject = JSON.parse(obtainedObject);
    printIssues(parsedObject);
    printLabels(parsedObject);
    document.getElementById("update-title").innerHTML =
        "<h5 class='text-light'>Enter Issue Index<input id='update-title-number' type='number'><br>Enter Issue Title &nbsp;<input id='update-title-name' type='text'><br><center><button id='update-button' onclick='updateTitle()'>Update title</button></h5></center>";
}

async function addLabel(issueId) {
    const url =
        "https://api.github.com/repos/jameerbasha2/samplerepo/issues/" +
        issueId +
        "?access_token=" +
        accessToken;
    const responseValue = await requestIssues();
    const responseObject = JSON.parse(responseValue);
    var indexNumber = Object.keys(responseObject).length;
    const currentIssue = responseObject[indexNumber - issueId];
    var currentLabelList = [];
    for (let label in currentIssue["labels"]) {
        currentLabelList.push(currentIssue["labels"][label]["name"]);
    }
    var toBeAddedLabel = document.getElementById("input-label-number-" + issueId)
        .value;
    for (let label in currentLabelList) {
        if (toBeAddedLabel === currentLabelList[label]) {
            return;
        }
    }
    currentLabelList.push(toBeAddedLabel);
    var labelObject = {
        labels: currentLabelList
    };
    let promise = await request(url, "POST", labelObject);
    getIssues();
}

async function updateTitle() {
    var updateTitleNumber = document.getElementById("update-title-number").value;
    var updateTitleName = document.getElementById("update-title-name").value;
    let url =
        "https://api.github.com/repos/jameerbasha2/samplerepo/issues/" +
        updateTitleNumber +
        "?access_token=" +
        accessToken;
    let updateObject = { title: updateTitleName };
    let promise = await request(url, "PATCH", updateObject);
    getIssues();
}