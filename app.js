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
        "/issues?access_token=121d3bdb1f85d20bb568a56b9c1842837fa7bb96";
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

function printLabels(responseObject) {
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

        indexNumber -= 1;
    }
}
// https://api.github.com/repos/jameerbasha/samplerepo/issues/10?labels=testing?access_token=07ea2d0db57fb843f4ce7f1b6864ceae8e443850
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