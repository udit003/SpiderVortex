
const createBtn = document.getElementById('newItemBtn');
const updateBtn = document.getElementById('updateItemBtn');
const item = document.getElementById('todoText');


function createListElement(todo){
	var li = document.createElement('li');
	li.setAttribute("data-todoid",todo._id);
	li.setAttribute("data-priority",todo.priority);
	var b = document.createElement('b');
	b.innerHTML = todo.text;
	b.addEventListener('click',deleteTodo);
	li.appendChild(b);
	var btn = document.createElement('button');
	btn.setAttribute("class","edit");
	btn.addEventListener('click',updateTodo);
	btn.innerHTML= "&#9998;" ;
	li.appendChild(btn);
	return li;
}


function updateTodo(event){
//to be done
event.preventDefault();
this.parentNode.style.display= 'none';
createBtn.style.display = "none";
updateBtn.style.display = "block";
item.value = this.previousSibling.innerHTML;
item.focus();
document.getElementById('priorityValue').value = this.parentNode.getAttribute('data-priority');
}

function deleteTodo(event){
	var parentLi =  this.parentNode;
	var todoid = parentLi.getAttribute('data-todoid');
	var req_ob = {"id" : todoid};
	makeAjaxRequest("POST",(window.location.href).toString()+'delete',updatePage,JSON.stringify(req_ob));
	//console.log(inputTag.value);
}

function populateData(xhttp){
	var entries = xhttp.responseText;
	//console.log(entries);
	var todos = JSON.parse(entries);
	//console.log(todos.length);
	var todoTable = document.getElementById("todo-table");
	if(todos.length>0){
		var ul = document.createElement('ul');
		todoTable.appendChild(ul);
		for(let i = 0;i<todos.length;i++){
			var li = createListElement(todos[i]);
			ul.appendChild(li);
		}
	}
}

function updatePage(){
	window.location.reload(true);
}


function makeAjaxRequest(method,url,callback,bodyData){
	var xhttp = new XMLHttpRequest();
	xhttp.open(method,url,true);

	xhttp.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200) {
			callback(this);
		}
	};

	if(method=='POST'){
		xhttp.setRequestHeader("Content-type", "application/json");
		xhttp.send(bodyData);
	}
	else{
		xhttp.send();
	}
}

window.onload = function(){
	makeAjaxRequest("GET",(window.location.href).toString()+'getEntries',populateData);

	//console.log(createBtn);
	createBtn.addEventListener('click',function(e){
		e.preventDefault();
		var priority = document.querySelector("#priorityValue option:checked");
		if(item.value !='' && priority.value !=''){
		 	var req_ob = {"text" : item.value,"priority":priority.value};
		 	makeAjaxRequest("POST",(window.location.href).toString()+'create',updatePage,JSON.stringify(req_ob));
		 }
	});


	updateBtn.addEventListener('click',function(e){
		e.preventDefault();
		var priority = document.querySelector("#priorityValue option:checked");
		if(item.value !='' && priority.value !=''){
		 	var req_ob = {"text" : item.value,"priority":priority.value};
		 	makeAjaxRequest("POST",(window.location.href).toString()+'update',updatePage,JSON.stringify(req_ob));
		 }
	});

	
};
