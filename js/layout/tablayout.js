// import {FileController} from "./filecontrols.js";

const openTab = (element) => {
    // console.log(element);
    // console.log(element.id);
    // console.log(element.className);
    // console.log(element.innerHTML);

    //Hide all the tabs
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    //Uncolor all the tab selectors
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = "";
    }

    const tabcontentToHighlight = element.id.trim() ? element.id.trim().split("-")[1] : "";

    console.log(tabcontentToHighlight);

    document.getElementById(tabcontentToHighlight).style.display = "block";
    // element.style.backgroundColor = black;

}

const addTab = (element) => {

    console.log(fc.totalFiles());

    fc.addFile();
    const fileNum = fc.totalFiles();

    tab_container = document.getElementById("contain_editors");
    tablink_container = document.getElementById("contain_tablinks");

    let div_tab = document.createElement("div");
    div_tab.id = `file${fileNum}`;
    div_tab.className = "tabcontent";
    div_tab.innerHTML = "Start typings .....";

    // let div_tab = `<div id="file${fileNum}" class="tabcontent">Start typings ..... </div>`
    let button_tab = document.createElement("button");
    button_tab.id = `tab-file${fileNum}`;
    button_tab.className = "button_effect tablink"
    button_tab.innerHTML = `File${fileNum}`
    button_tab.setAttribute("onclick","openTab(this)");

    tab_container.appendChild(div_tab);
    // document.getElementById(div_tab.id).className += " ";

    tablink_container.insertBefore(button_tab, element);
    // document.getElementById(button_tab.id).className += " button_effect tablink";

    //click the newly added button to select it.
    button_tab.click();
    button_tab.focus();
}


