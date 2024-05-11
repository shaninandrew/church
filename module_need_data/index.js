// Конфигурация всех служб, которые доступны пользователю
let Need_catalog  =
{
Names:["Акафист","Записки","Исповедь","Сорокоуст"],
Urls:["/module_need_data/akafist.json",
"/module_need_data/letters.json",
"/module_need_data/speakout.json",
 "/module_need_data/fortydayspray.json"]
};

var need_app =null;

function change_ritual(selected_item)
{
   // alert ("Выбрали!");
  
   try{
    console.log ("√ Грузим данные:" +selected_item.value);
    //грузим конфиг по пути

    //Размывашки при загрузе
    document.getElementById(need_app.DivElementId).style="filter:blur(4px);";
   
    need_app.Load(selected_item.value);
    // тут выбран путь файла /module_need_data/letters.json
   }
   catch
   {
    console.log (" X  Файл с конфигом  отсутствует: " +selected_item.value);
   }
   finally
   {
   // document.documentElement.style="filter: blur(0);";
    //console.log ("√ На страницу размытие снято!");
    
   }

}

//Отправка на сервер инфы
function Need_submit(info)
{
    console.log (" √ Передеано на отправку " +JSON.stringify(info));
    alert(info);
}

//Калькулятор стоимости
function RecalcPrice(idElementNames, idPriceElement, Need)
{
    const text= document.getElementById(idElementNames).value
    const names = text.split(/[,\s]/g);
    count=0;

    for(var i=0; i<names.length; i++)
        if (names[i]!="") count++;
    
    let price = Need.Price * count;

    let cur_value = document.getElementById(idPriceElement).value;
    if (cur_value< price )
        {
            cur_value=price;
            alert ("У Вас указан ритуал для "+count+" человек. Мы просим немного более...");
        }
    document.getElementById(idPriceElement).value=cur_value;

    
    
}