/// Треба
class Need_Service
{
    // Класс требы: каталог сос списком всех треб,  название требы, опции МАССИВ, место проведения, бенефициар
    constructor(catalog, Name, Option, Place, Who, Url_strorage, price) 
    {
         this.Name = Name;
         this.Option= Option;
         this.Place = Place;
         this.Who = Who;
         this.Url = Url_strorage; //адрес где храниться
         this.Price = price; //стоимость услуги

         this.Need_Catalog = catalog;//каталог
    }
    
    //Show Data
   Show()
    {
        console.log("DEBUG:" + typeof (this)+ " >> "+ JSON.stringify(this));
        console.log("DEBUG/NAME:" + this.Name);
    }
    
    //Возвращает html код в div.innerHTML
    get PrintRitual()
    {
        var rites="";
        var i=0;
        //console.log ("Каталог ритуалов:" +JSON.stringify(this.Need_Catalog));
        this.Need_Catalog.Names.forEach(element => {
            rites+="<option value=\""+this.Need_Catalog.Urls[i]+"\"   "+ (this.Name ==this.Need_Catalog.Names[i]?"selected":"" ) +" > "+element+" </option>";
            i++;
        });

        return "<select class=need_input name=need_ritual placeholder='Вид обряда' onchange='change_ritual(this);'> " +rites+ "</select>";
    }


     //Возвращает html код в div.innerHTML
     get PrintPrice()
     {
         var options="";
         return "<input type=\"number\" class=need_input id=need_price name=need_price placeholder='Размер пожертвования' min=100 max=15000  required=\"required\" step=100 value="+this.Price+"  onchange='RecalcPrice(\"need_who\",\"need_price\",need_app.Wrapper_Ritual.Need);'> </input>";
     }

    //Возвращает html код в div.innerHTML
    get PrintOptions()
    {
        var options="";
        this.Option.forEach(element => {
            options+="<option value=\""+element+"\"> "+element+" </option>";

        });
        return "<select class=need_input name=need_option placeholder='Особенность проведения обряда'> " +options+ "</select>";
    }

    //Выводит выборку мест, где идет треба
    get PrintPlace()
    {

        var options="";
        this.Place.forEach(element => {
            options+="<option value=\""+element+"\"> "+element+" </option>";

        });
        return "<select class=need_input name=need_place required=\"required\" placeholder='Место проведения обряда'> " +options+ "</select>";
    }

    //Inner для бенефициара
    get PrintWho ()
    {
        //тут передается гловбальная переменная
        // this.Wrapper_Ritual.Need
        return "<input required=\"required\" class=need_input id=need_who name=need_who placeholder='Имена людей через пробел или запятую. Иван Петр ...' onchange='RecalcPrice(\"need_who\",\"need_price\",need_app.Wrapper_Ritual.Need);'> </input>";
    }

}

///Асинхронный загрузчик
class Need_Loader
{
     //загрузка списка опций Promise (Task C#)
    async Load(Path)
    {
        console.log ("1 Load: "+Path);
        //JSON загрузка
        const resp = await fetch(Path);
        const x =  await resp.json();

        console.log ("LAODER: "+ JSON.stringify(x));
        var _Need =  new Need_Service (Need_catalog, x.Name,x.Option, x.Place, x.Who, x.Url ,x.Price); 
        this.Need = _Need;
        return _Need;
    }

     constructor (Url)
     {
         this.Load(Url).then(
            x=> {
                this.Need =x;
                this.Need.Show();

            }
        );
     }

     get Get()
     {
        return (this.Need);
     }

}

/// Класс собирающий форму
class Need_Form
{
    constructor (Need, NameOfForm, Method="PUT", Path="/") 
    { 
        this._form="Загрузка...";
        if (Need==null)
        {
            console.log ("Передан нулевой объект!" +Need);
            return;
        }


        console.log ("Передан корректный объект: " +typeof(Need));
        console.log(JSON.stringify(Need));

        this._form ="<FORM Method="+Method+" Path='"+Path+"'  name='"+NameOfForm+"'>";
        this._form  +="<div class=need_grid> <div class=need_label> Обряд </div>" +Need.PrintRitual         + "</div>";
        this._form  +="<div class=need_grid><div class=need_label>Особенность </div>"+ Need.PrintOptions + "</div>";
        this._form  +="<div class=need_grid><div class=need_label>Место проведения </div>"+Need.PrintPlace + "</div>";
        this._form  +="<div class=need_grid><div class=need_label>Бенефициар </div>"+ Need.PrintWho + "</div>";
        this._form  +="<div class=need_grid><div class=need_label>Размер пожертвования </div>"+ Need.PrintPrice + "</div>";

        
        this._form   +="<div class=need_button_placeholder><button class=Need_Submit onclick=\"Need_submit(this)\"> Пожертвовать на ритуал</Button> </div>";
        this._form   +="</FORM>";

    }

    get Form ()
    {
        return this._form;
    }

}


//Класс работы с формой на высоком уровне -
//путь к конфигу и грузит ритуал

class Need_Application
{

    constructor (rite, DivElementId)
    {
        //грузим ритуал
        this.Wrapper_Ritual = new Need_Loader(rite);
        this.DivElementId = DivElementId;
        this.Load(rite);
     
    }

    // Грузит форму обряда по конфигу
    Load (rite_url)
    {
        //Размывашки при загрузе
        document.getElementById(this.DivElementId).style="filter:blur(4px);";
   
        this.Wrapper_Ritual = new Need_Loader(rite_url);
          // через некоторое время выводим его на форму 1.5 сек
         setTimeout(() => {
        
            //Переменная ритуала
            var Rite =  this.Wrapper_Ritual.Need;

            //Форма
            var form = new Need_Form(Rite ,"NeedForm");
            // Выводим форму
            document.getElementById(this.DivElementId).innerHTML =  form.Form;
            //console.log(form.Form);
            
            //Размывашки при загрузе
            document.getElementById(this.DivElementId).style="filter:blur(0);";
        }, 1500);
    }

}