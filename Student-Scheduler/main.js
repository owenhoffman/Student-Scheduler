var num_courses = 0;
var num_semesters = 0;
var num_years = 0;

//returns a chunk of html as a string
//semester_id is the id attribute of the semester div
//course_num describes ordinally which course in the semester it is (e.g. 1 for 1st or 4 for 4th)
function newCourse(semester_id, course_num){
	var id = semester_id + '-course' + course_num;
	return '<div class="course flex-row ' + semester_id + '" id="' + id + 
			'" semester_id="' + semester_id + '" course_num="' + course_num + '">' +
			'\n\t<button class="delete-button course-delete-button">x</button>' +
			'\n\t<input type="text" class="course-number" value="' + course_num + '" readonly>' +
			'\n\t</input>' +
			'\n\t<input type="text" class="course-title">' +
			'\n\t</input>' +
			'\n\t<input type="text" class="course-credits">' +
			'\n\t</input>' +
			'\n\t<input type="text" class="course-categories">' +
			'\n\t</input>' +
		'\n</div><!--END course-->';
}

function addCourse(semester_id){
	num_courses++;
	var course_num = num_courses;
	//var course_num = $("#" + semester_id + " .course").length + 1;
	$("#" + semester_id).append(newCourse(semester_id, course_num));
	//adds functionality to the new delete button
	$('#' + semester_id + '-course' + course_num + ' .delete-button').click(function(){
		deleteCourse(semester_id, course_num);
	});
	renumberCourses(semester_id);
}

//removes this course from the semester, and then calls renumberCourses to renumber the remaining courses
function deleteCourse(semester_id, course_num){
	var course_id = semester_id + "-course" + course_num;
	$('#'+course_id).remove();
	renumberCourses(semester_id);
}

//renumbers the courses in the semester
function renumberCourses(semester_id){
	var remainingCourses = $('#' + semester_id + ' .course');
		for(var i = 0; i < remainingCourses.length; i++){
			console.log(remainingCourses[i]);
			$('#' + remainingCourses[i].id + ' .course-number').attr('value', i+1);
		}
}

function newSemester(year_id, semester_num, semester_name){
	return '<div class="semester ' + year_id + '" id="semester' + semester_num + 
				'" year_id="' + year_id + '" semester_num="' + semester_num + 
				'" semester_name="' + semester_name + '">' +
				'\n\t<button class="delete-button delete-semester-button">x</button>' +
				'\n\t<strong>' + semester_name + '</strong>' +
				'\n\t<button class="add-button add-course-button">+</button>' +
			'\n</div><!--END semester-->';
}

function addSemester(year_id){
	num_semesters++;
	var semester_num = num_semesters;
	var semester_name = prompt("Semester name?", "Semester");
	$('#' + year_id + ' .semester-row').append(newSemester(year_id, semester_num, semester_name));
	//gives functionality to the + button, allowing user to add courses to this semester
	$('#semester' + semester_num + ' .add-course-button').click(function(){
		addCourse('semester' + semester_num);
	});
	//gives functionality to the x button, allowing user to delete this semester
	$('#semester' + semester_num + ' .delete-semester-button').click(function(){
		deleteSemester('semester' + semester_num);
	});
}

//removes the given semester from the DOM
function deleteSemester(semester_id){
	$('#' + semester_id).remove();
}

function newYear(year_id, year_num, year_name){
	return '<div class="year" id="' + year_id + '" year_num="' + year_num + '" year_name="' + year_name + '">' +
				'\n\t<div class="flex-row header-row">' +
					'\n\t\t<button class="delete-button delete-year-button">x</button>' +
					'\n\t\t<strong>' + year_name + '</strong>' +
					'\n\t\t<button class="add-button add-semester-button">+</button>' +
				'\n\t</div>' +
				'\n\t<div class="flex-row semester-row">' +
				'\n\t</div>' +
			'\n</div>';
}

function addYear(){
	num_years++;
	var year_num = num_years;
	var year_name = prompt("Year name?", "Year");
	var year_id = "year"+year_num;
	//puts the year inside the courses div
	$("#courses").append(newYear(year_id, year_num, year_name));
	//gives functionality to the + button, allowing user to add semesters to this year
	$('#year' + year_num + ' .header-row .add-semester-button').click(function(){
		addSemester('year' + year_num);
	});
	//gives functionality to the x button, allowing user to delete this year
	$('#year' + year_num + ' .header-row .delete-button').click(function(){
		deleteYear('year' + year_num);
	}); 
}

function deleteYear(year_id){
	$('#' + year_id).remove();
}

function save(){

	//changes the value of each course-title, course-credits, and course-categories
	//so that the contents are saved in the html
	var courses = $('.course');
	for(var i = 0; i < courses.length; i++){
		$('#' + courses[i].id + ' .course-title').attr("value", $('#' + courses[i].id + ' .course-title').val());
		$('#' + courses[i].id + ' .course-credits').attr("value", $('#' + courses[i].id + ' .course-credits').val());
		$('#' + courses[i].id + ' .course-categories').attr("value", $('#' + courses[i].id + ' .course-categories').val());
	}

	var save_data = JSON.stringify({'html': $("#wrap").html(), 'num_courses':num_courses, 
		'num_semesters':num_semesters, 'num_years':num_years});
	$('#save-dialog').html('Copy and Paste this into a text file.\n' +
		'Save the file so you can load it later!\n' + 
		"<textarea>" + save_data +  "</textarea>");
	$('#save-dialog textarea').select();
	$('#save-dialog').dialog({
		title: "Save Dialog",
		height: 500,
		width: 500
	});
	
	console.log(save_data);
}

function load(save_data){
	var data = JSON.parse(save_data);
	num_courses = data.num_courses;
	num_semesters = data.num_semesters;
	num_years = data.num_years;
	$('#wrap').empty();
	$('#wrap').append(data.html);
	
	//gives functionality to all the buttons
	var courses = $('.course');
	for(var i = 0; i < courses.length; i++){
		id = courses[i].id;
		$('#' + id + ' .course-delete-button').click(function(){
			$('#'+ id).remove();
			renumberCourses($('#'+id).attr('semester_id'));
		});
	}
}

function load_dialog(){
	var save_data;
	//pops up a dialog using JQueryUI, prompting for the save data
	$('#load-dialog').html('Copy and Paste your old save file here.\n' +
		'You can load your old data!' +
		'<textarea></textarea>');
	$('#load-dialog').dialog({
		title: "Load Dialog",
		height: 500,
		width: 500,
		buttons: [
			{
				text: "Load",
				click: function(){
					save_data = $('#load-dialog textarea').val();
					load(save_data);
					$(this).dialog("close");
				}
			}
		]
	});
}


$(document).ready(function(){

	console.log("Jquery started");

	$("#load-button").click(load_dialog);
	$("#save-button").click(save);
	

	$(".add-course-button").click(function(){
		//gets the id of the active semester and adds a course to it
		addCourse($(this).parent().attr('id'));
	});

	$(".add-year-button").click(function(){
		addYear();
	});

	

});
