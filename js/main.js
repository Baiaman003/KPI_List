
$(window).ready(function(){//после загрузки window 
  render() //вызываем функцию render()
})

$('.btnAdd').on('click', function(e){
  e.preventDefault();
    let data = $('.add_form').serialize();

    $.ajax({
      method: 'post',
      url: "http://localhost:8000/students",
      data,
      success: render
    });
  $('.add_form input').val('')
  render()
});

$('.openAddModal').on('click', function(){
  $('.add_modal').css('display','block')
});
$('.btnX').on('click', function(){
  $('.add_modal').css('display','none')
});
$('.add_modal').on('click',function(e){
  if(e.target !== e.currentTarget)return;
  $(this).css('display','none');
});

// -----------------------------------------------------------
let page = 1;
function render() {
  $.ajax({
      method: 'get',
      url: `http://localhost:8000/students/?_page=${page}&_limit=3`,
      success: function(data) {           
          $('.students_list').html('');
          data.forEach(item => {
              $('.students_list').append(`
                <li data-id="${item.id}" class="students">
                  <img class="prophil" data-id="${item.id}" src="${item.urlFoto}">
                  <span data-id="${item.id}">${item.fio}</span>
                </li>
              `);
          });
      }
  });
}
let kpiSaveID = '';
//----------------------------------------------------------------
$('.students_list').on('click', 'li', function(e){
  $('.student_modal').css('display','block')
  $('.student_form').text('');
  let target = $(e.target);
  let id = target.attr('data-id');
  kpiSaveID = id;
  $.ajax({
    method: 'get', 
    url: `http://localhost:8000/students/${id}`,
    success: function(data){
      let kpi = (parseInt(data.late) + parseInt(data.tasks) + parseInt(data.int) + parseInt(data.bonus))/4
      $('.student_form').append(`
        <div class="btnX" data-id="${data.id}">x</div>
        <li class="liMod" ><img class="prophil" data-id="${data.id}" src="${data.urlFoto}"></li>
        <li class="liMod">Имя: <span data-what="fio" data-id="${data.id}">${data.fio}</span></li>
        <li class="liMod">Группа: <span data-what="group" data-id="${data.id}">${data.group}</span></li>
        <li class="liMod">KPI: <span class="kpiMod" data-what="kpi" data-id="${data.id}">${kpi}</span></li>
        
        <div class="kpiModList dNone">
        <li class="liMod">Посещение: <span data-what="late" data-id="${data.id}">${data.late}</span></li>
        <li class="liMod">Задании: <span data-what="tasks" data-id="${data.id}">${data.tasks}</span></li>
        <li class="liMod">Интервю: <span data-what="int" data-id="${data.id}">${data.int}</span></li>
        <li class="liMod">Доп балы: <span data-what="bonus" data-id="${data.id}">${data.bonus}</span></li>
        </div>
        <div class="modalDiv"><button class="btnDelete">Delete</button></div>
      `);
    }
  })
});
$('.student_form').on('click', '.btnX', function(){
  $('.student_modal').css('display','none')
});
$('.student_modal').on('click',function(e){
  if(e.target !== e.currentTarget)return;
  $(this).css('display','none');
});
//----------------------------------------------------------------------
$('.student_form').on('click', 'span', function(e){
  let target = $(e.target);
  let what = target.attr('data-what');
  if(what==='kpi'){
    $('.kpiModList').toggleClass('dNone');
    $('.btnSave').toggleClass('dNone');
  }else{
    let text = $(e.target).text();
    target.html(`<input type="text" class="inpUpdate" value="${text}">`);
  }
});
$('.student_form').on('focusout', '.inpUpdate', function(e) {
  let target = $(e.target);
  let id = target.parent().attr('data-id');
  let result = target.val();
  let what = target.parent().attr('data-what');
  let data = {};
  data[what]=result;
  target.parent().html('').text(result);
  // $('.kpiMod').html('').text(result)
  $.ajax({
      method: 'patch',
      url: `http://localhost:8000/students/${id}`,
      data,
      success: render
  });

  render();
});

$('.inpSearch').on('keyup', function() {
  let inp = $('.inpSearch').val()
  $.ajax({
      method: 'get',
      url: `http://localhost:8000/students?q=${inp}`,
      success: function(data){
          if(inp!==''){
            $('.students_list').html('');
              data.forEach(item => {
                $('.students_list').append(`
                  <li data-id="${item.id}" class="students">
                    <img class="prophil" data-id="${item.id}" src="${item.urlFoto}">
                    <span data-id="${item.id}">${item.fio}</span>
                  </li>
                `);
              });
          }
      }
  });
});


//----------------------------------------------Удаление------------------
$('.student_form').on('click', '.btnDelete', (e)=>{
  e.preventDefault();
  let id = $('.ModalWind').attr('data-id');
  let q = confirm('Вы уверены?');

  if(q==true){
    $.ajax({
        method: 'delete',
        url: `http://localhost:8000/students/${kpiSaveID}`,
        success: function(){
          render();
        console.log('Вы удалили данные!');
        $('.student_modal').css('display','none')
       
      },
      error: function(error){  
        console.log('Произошла ошибка!!!');
      }
    })
  } else{return};
    
});

  //Пагинация

  $('.btnNext').on('click', function(){
    page++
    $.ajax({
      method:"get",//Получаем 
      url:`http://localhost:8000/students?_page=${page}&_limit=3`,//из указанного сервера
      success: function(data) {//если успешно получили
        if(data.length==0) {
          page--
         
        }else{
          $('.students_list').html('');
          render()
        }
      }
      });
  });
  $('.btnPrev').on('click', function(){
    if(page>1){
      page--
      $.ajax({
        method:"get",//Получаем 
        url:`http://localhost:8000/students?_page=${page}&_limit=3`,//из указанного сервера
        success: function(data) {//если успешно получили
  
            $('.students_list').html('');
            // data.map((item) =>{ //переберам полученные данные и добавлем в <ul> все найденные имена
              render()
            // });
          
        }
        });
    }
  });

//---------------------------------------------
$('.prophil').on('click', function(){
  alert()
  $(this).html(`<input type="text" class="inpUpdate" value="https://blinmen.ru/wp-content/uploads/2011/09/user-profile.png">`);
});







