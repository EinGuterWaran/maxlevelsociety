var menu = "dashboard";
var tablerow = "<tr>\n" +
    "                    <th scope=\"row\">[place]</th>\n" +
    "                    <td>[name]</td>\n" +
    "                    <td>[points]</td>\n" +
    "                </tr>";

async function getJson(url) {
    let response = await fetch (url);
    let data = await response.json();
    return data;
}

setTimeout(function(){
    var content = document.getElementById("content");
    document.getElementById("dashboard").addEventListener ("click", function(){switchMenu("dashboard");}, false);
    document.getElementById ("subjects").addEventListener ("click", function(){switchMenu("subjects");}, false);
    document.getElementById ("students").addEventListener ("click", function(){switchMenu("students");}, false);
    document.getElementById ("items").addEventListener ("click", function(){switchMenu("items");}, false);
    document.getElementById ("tests").addEventListener ("click", function(){switchMenu("tests");}, false);
    main();
}, 500);
function reloadCSS() {
    const links = document.getElementsByTagName('link');

    Array.from(links)
        .filter(link => link.rel.toLowerCase() === 'stylesheet' && link.href)
        .forEach(link => {
            const url = new URL(link.href, location.href);
            url.searchParams.set('forceReload', Date.now());
            link.href = url.href;
        });
}

function switchMenu(newMenu) {
    menu = newMenu;
    console.log(newMenu);
    clearContent();
    setTimeout(function(){
        main();
    }, 100);
}

function clearContent() {
    content.innerHTML = "";
}

function clearMenu(){
    const menupoints = ["dashboard","subjects", "students", "items", "tests"];
    menupoints.forEach(menupoint => document.getElementById(menupoint).removeAttribute("aria-current"));
    menupoints.forEach(menupoint => document.getElementById(menupoint).setAttribute("class","nav-link"));
}
async function main(){
    var data = await getJson("../data.json");
    clearMenu();
    document.getElementById(menu).setAttribute("aria-current","page");
    document.getElementById(menu).setAttribute("class","nav-link active");
    content.appendChild(generateContent(data));
    reloadCSS();
    document.getElementById("title").innerText = menu.charAt(0).toUpperCase()+menu.slice(1);
}

function generatTh(heads, table){
    var th = document.createElement("thead");
    var head = "<tr>";
    for (var i = 0; i < heads.length;i++){
        head+= "<th scope=\"colr\">"+heads[i]+"</th>";
    }
    head+="</tr>";
    th.insertAdjacentHTML('beforeend', head);
    table.appendChild(th);
}

 function generateContent(data){
    var table = document.createElement("table");
    table.classList.add('table');
    table.classList.add('table-striped');
    table.classList.add('table-hover');
    var tbody = document.createElement("tbody");
     if (menu == "subjects") {
         generatTh(["Id","Subject", "highscore"], table);
         var subjects = data["subjects"];
         var subid=0;

         for (var key in subjects) {
             var tr = document.createElement("tr");
             tr.insertAdjacentHTML("beforeend", "<td>"+subid+"</td><td>"+key.charAt(0).toUpperCase()+key.slice(1)+"</td>");
             var hightable = document.createElement("table");
             hightable.classList.add('table');
             hightable.classList.add('table-striped');
             hightable.classList.add('table-hover');
             hightable.setAttribute("id", "highscore"+subid);
             var highbody = document.createElement("tbody");
             var hightd = document.createElement("td");
             for (var j = 0; j < subjects[key]["highscore"].length; j++){
                 highbody.insertAdjacentHTML("beforeend",
                     tablerow.replace("[name]", subjects[key]["highscore"][j]["name"])
                         .replace("[place]",(j+1).toString())
                         .replace("[points]", subjects[key]["highscore"][j]["exp"]));
             }
             hightable.appendChild(highbody);
             hightd.appendChild(hightable);
             tr.appendChild(hightd);
             tbody.appendChild(tr);
             subid++;
         }

         tbody.insertAdjacentHTML("beforeend","<tr><td></td><td><input type='text'></td><td><input type='button' value='Add subject!'></td></tr>")
         table.appendChild(tbody);
     }

     else if (menu == "students") {
        var students = data["students"];
        generatTh(["Id","Name","Badges","Items", "avatar"], table);
        for (var s = 0; s < students.length; s++){
            tbody.insertAdjacentHTML("beforeend", "<tr><td>"+students[s]["id"]+"</td><td>"+students[s]["name"]+"</td><td>"+students[s]["badges"]+"</td><td>"+students[s]["items"]+"</td><td><img height='100' onerror=\"this.style.display='none'\" alt=\"Don't have an avatar yet\" src='../"+students[s]["char"]+"'></td></tr>")
        }
        tbody.insertAdjacentHTML("beforeend","<tr><td></td><td><input type='text'></td><td><input type='button' value='Add student!'></td><td></td><td></td></tr>")
         table.appendChild(tbody);
    }

     else if (menu == "items") {
         var items = data["items"];
         generatTh(["Id","Name","Letter", "Price", "Scarcity (1-100)", "type", "kind", "scale","Image"], table);
         for (var i = 0; i < items.length; i++){
             tbody.insertAdjacentHTML("beforeend",
                 "<tr><td>"+items[i]["id"]+"</td><td>"+items[i]["name"]+"</td>" +
                 "<td>"+items[i]["let"]+"</td><td>"+items[i]["price"]+"</td>" +
                 "<td>"+items[i]["scarcity"]+"</td><td>"+items[i]["type"]+"</td>" +
                 "<td>"+items[i]["kind"]+"</td><td>"+items[i]["scale"]+"</td>" +
                 "<td><img height='100' src='../img/furniture/"+items[i]["src"]+"'></td></tr>")
         }
         tbody.insertAdjacentHTML("beforeend","<tr><td></td><td><input type='text'></td><td><input type='text'></td>" +
             "<td><input type='text'></td><td><input type='text'></td><td>" +
             "<select id=\"type\" name=\"type\">\n" +
             "  <option value=\"clothing\">clothing</option>\n" +
             "  <option value=\"furniture\">furniture</option>\n" +
             "</select>\n" +
             "</td><td><input type='text'></td><td><input type='text'></td>" +
             "<td><input type='file'></td><td><input type='button' value='Add Item!'></td></tr>")
         table.appendChild(tbody);


    } else if (menu == "tests") {
         table = document.createElement("h1");
         table.insertAdjacentText("beforeend", "Here would be a module to add and edit tests.");

    } else {
    table = document.createElement("h1");
    table.insertAdjacentText("beforeend", "Welcome Mrs. Teacher!");
    }
    return table;

}