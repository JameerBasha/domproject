async function request(url) {
    const Http = new XMLHttpRequest();
    Http.open("GET", url);
    Http.send();
    let promise = new Promise((res, rej) => {
        Http.onreadystatechange = e => {
            if (Http.readyState == 4 && Http.status == 200) {
                res(String(Http.responseText));
            }
        };
    });
    let result = await promise;
    return result;
}

async function requestIssues(req, res) {
    var username = document.getElementById("username-input").value;
    var reponame = document.getElementById("reponame-input").value;
    const url =
        "https://api.github.com/repos/" +
        username +
        "/" +
        reponame +
        "/issues?access_token=a945bd7861149715ace2fd4b1137be371bbecd90";
    let promise = new Promise((res, rej) => {
        res(request(url));
    });

    let result = await promise;
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
    const urlv =
        "https://api.github.com/repos/jameerbasha/samplerepo/labels?access_token=a945bd7861149715ace2fd4b1137be371bbecd90";
    let promise = await fetch(urlv, {
        method: "GET",
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        }
    });
    let responseValue = await promise.text();
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
    for (let label in labels) {
        for (let individualLabel in labels[label]) {
            var spaceElement = document.createElement("span");
            spaceElement.innerHTML = "&nbsp; &nbsp";
            var newlabel = document.createElement("span");
            newlabel.setAttribute("class", "individual-label");
            newlabel.setAttribute("Id", "label-number" + indexNumberOfLabel);
            newlabel.setAttribute(
                "onclick",
                "removeLabel" + "(" + indexNumberOfLabel + ")"
            );
            newlabel.innerHTML = labels[label][individualLabel]["name"];
            newlabel.style.background = "#" + labels[label][individualLabel]["color"];
            newlabel.style.color = "#000000";
            document
                .getElementById("label-container-number" + indexNumber)
                .appendChild(newlabel);
            document
                .getElementById("label-container-number" + indexNumber)
                .appendChild(spaceElement);
            indexNumberOfLabel += 1;
        }
        var newAddInput = document.createElement("select");
        let arrayOfLabels = await getListOfLabels();
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
// https://api.github.com/repos/jameerbasha/samplerepo/issues/10?labels=testing?access_token=a945bd7861149715ace2fd4b1137be371bbecd90
async function removeLabel(labelIndex) {
    document.getElementById("label-number" + labelIndex).remove();
}

async function getIssues() {
    let promise = new Promise((res, rej) => {
        res(requestIssues());
    });
    let obtainedObject = await requestIssues();
    parsedObject = JSON.parse(obtainedObject);
    printIssues(parsedObject);
    printLabels(parsedObject);
}

// function addLabel(issueId) {
//     var nonee = document.getElementById("input-label-number-" + issueId);
//     if (nonee.value === "") {
//         alert("No label entered");
//         return;
//     } else {
//         console.log(nonee.value);
//     }
// }

async function addLabels(issueId) {
    const urlv =
        "https://api.github.com/repos/jameerbasha/samplerepo/issues/" +
        issueId +
        "?access_token=a945bd7861149715ace2fd4b1137be371bbecd90";
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
    if (toBeAddedLabel in currentLabelList) {
        return;
    } else {
        currentLabelList.push(toBeAddedLabel);
    }

    console.log(currentLabelList);
    // let promise = await fetch(urlv, {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json;charset=utf-8"
    //     },
    //     body: JSON.stringify(labelObject)
    // });
    // let text = await promise.text();
    // console.log(text);
}