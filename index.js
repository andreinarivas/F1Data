
const searchTerm = document.getElementById("query");
const searchButton=document.getElementById("search_button");
const resultsElement =document.getElementById("results");
const year2023 = document.getElementById("2023");
const year2022 = document.getElementById("2022");
const year2021 = document.getElementById("2021");
console.log(searchTerm)
const BASE_URL="http://ergast.com/api/f1/"
const options={
  method:"GET",
  redirect:"follow"
}

let year="2023";
year2023.addEventListener("click", ()=>{
    year=2023;
    year2023.style="background-color:#FF3C38;"
    year2022.style="background-color:#97CCD;"
    year2021.style="background-color:#97CCD;"
  })
year2022.addEventListener("click", ()=>{
    year=2022;
    year2022.style="background-color:#FF3C38;"
    year2023.style="background-color:#97CCD;"
    year2021.style="background-color:#97CCD;"
  })
year2021.addEventListener("click", ()=>{
    year=2021;
    year2021.style="background-color:#FF3C38;"
    year2023.style="background-color:#97CCD;"
    year2022.style="background-color:#97CCD;"
  })

  function parseXml(xml) {
    var dom = null;
    if (window.DOMParser) {
       try { 
          dom = (new DOMParser()).parseFromString(xml, "text/xml"); 
       } 
       catch (e) { dom = null; }
    }
    else if (window.ActiveXObject) {
       try {
          dom = new ActiveXObject('Microsoft.XMLDOM');
          dom.async = false;
          if (!dom.loadXML(xml)) // parse error ..
 
             window.alert(dom.parseError.reason + dom.parseError.srcText);
       } 
       catch (e) { dom = null; }
    }
    else
       alert("cannot parse xml string!");
    return dom;
 }

 function xml2json(xml) {
  try {
    var obj = {};
    if (xml.children.length > 0) {
      for (var i = 0; i < xml.children.length; i++) {
        var item = xml.children.item(i);
        var nodeName = item.nodeName;

        if (typeof (obj[nodeName]) == "undefined") {
          obj[nodeName] = xml2json(item);
        } else {
          if (typeof (obj[nodeName].push) == "undefined") {
            var old = obj[nodeName];

            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(xml2json(item));
        }
      }
    } else {
      obj = xml.textContent;
    }
    return obj;
  } catch (e) {
      console.log(e.message);
  }
}
searchButton.addEventListener("click", async()=>{
  console.log(year);
  const circuit=searchTerm.value;
  const response= await fetch(`${BASE_URL}${year}/${circuit}/qualifying`, options);
  const info = await response.text();
  const json = await xml2json(parseXml(info));
  const list = json.MRData.RaceTable.Race.QualifyingList;
  const drivers=Object.values(list)[0].slice(0,3);
  console.log(drivers);
  resultsElement.innerHTML= drivers
    ?.map((driver)=>{
      let pos=drivers.indexOf(driver)+1;
      const name = driver.Driver.GivenName;
      const last_name = driver.Driver.FamilyName;
      const lap_time = driver.Q3;
      console.log(name, last_name, lap_time)
      return `<div class="card">
              <h3 id="position">${pos}.</h3>
              <div class="lap_info">
              <h4>${name} ${last_name}</h4>
              <h5>${lap_time}</h5>
      </div>
    </div>`
    })
 })