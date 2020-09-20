const userTableLimit = 2
var productResult;
var categoriesResult;
var apiData = {
    urunType: null,
    urunName: null,
    urunPhotos: [],
    colorFiles: []
}
var ColorAdded = 0
var urunFiles = []
var isyVoteBigger 
var viewDataCollapseIsOpen = false
var editDataCollapseIsOpen = false
var lastEditDataCollapseDatas = []

$(document).ready(ReqUser)

function ReqUser() {
    try {


        $.ajax({
            url: "/api/products",

            data: {
                queryLimit: 25

            },
            success: async function (result) {

                if (!result) { throw new Error() }
                if (!result.docs) { throw new Error() }


                $('#productsTable').empty()
                productResult = result


                for (let index = 0; index < result.AlldocCount; index++) {


                    const element = result.docs[index];
                    if (!element) { throw new Error('element not found') }

                    var colorSchemeHTML = '';

                    await element.urunPhotos.forEach((colorElement) => {
                        colorSchemeHTML += '<a onclick="copyToClipboard(\'#' + colorElement.colorHEX + '\')"><span class="dot" aria-hidden="true" style="background-color:#' + colorElement.colorHEX + ';" data-toggle="tooltip" data-placement="top" title="' + colorElement.colorName + ' #' + colorElement.colorHEX + ' (click to copy)"></span></a>'
                    })



                    $("#productsTable").append(
                        `<tr>    
                        <td>`+ (index + 1) + `</td>
                        <td>`+ element.urunType + `</td>
                        <td>`+ element.urunName + `</td>
                        <td>
                        `
                        + colorSchemeHTML +

                        `
                        </td>
                        <td>
                        <a onclick="viewData('`+ index + `')" data-toggle="tooltip"><i
                        class="fas fa-eye view"></i></a>
                        <a onclick="editData('`+ index + `')" data-toggle="tooltip">
                        <i class="fas fa-pen edit"></i>
                        </a>
                        <a onclick="deleteData('`+ index + `')" data-toggle="tooltip">
                            <i class="fas fa-trash delete"></i>
                        </a>
                        </td>
                    <tr>`
                    );



                }
                $('#productsTableShowInfo').html(
                    `
                    Showing <b>`+ productResult.docs.length + `</b> out of <b>` + productResult.AlldocCount + `</b> entries
                    `
                )

            }
        });
        $.ajax({

            type: "GET",
            url: "/api/categories",

            data: {},
            success: function (result) {
                categoriesResult = result
            }


        });

    } catch (error) {
        console.log(result)
        console.log(error)
    }

}

function copyToClipboard(text) {
    var tempInput = document.createElement("input");
    tempInput.style = "position: absolute; left: -1000px; top: -1000px";
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);

}

function onColorClick(dataIndex,colorIndex){
    var data = productResult.docs[dataIndex];    
    var ThumbnailImgUsage = document.getElementById("ThumbnailImg");

    
    ThumbnailImgUsage.style.transitionDuration= "0.5s"
    ThumbnailImgUsage.style.opacity = 0;

    ThumbnailImgUsage.addEventListener('transitionend', () => {
        
        ThumbnailImgUsage.src = '../../assets/img/'+data.urunPhotos[colorIndex].coloredPreviewPath;    
    });

    ThumbnailImgUsage.addEventListener('load', () => {
        
        ThumbnailImgUsage.style.opacity = 1;
    });

    if(isyVoteBigger){
        
        ThumbnailImgUsage.style.width = "580px"
    
    }
    
    else{

        ThumbnailImgUsage.style.height = "460px"
    
    }

}

function ChangeIconFunc(){

    if(!viewDataCollapseIsOpen){
        $("#icon").removeClass("far fa-plus-square fa-2x").addClass("far fa-minus-square fa-2x");  
    }
    else{
        $("#icon").removeClass("far fa-minus-square fa-2x").addClass("far fa-plus-square fa-2x");
    }

    $('#ShowImageCollapse').on('hidden.bs.collapse', function () {
        viewDataCollapseIsOpen = false;
        //$("#icon").removeClass("far fa-minus-square fa-2x").addClass("far fa-plus-square fa-2x");
        
    })

    $('#ShowImageCollapse').on('shown.bs.collapse', function () {
        viewDataCollapseIsOpen = true;
        //$("#icon").removeClass("far fa-plus-square fa-2x").addClass("far fa-minus-square fa-2x");  
    })
    
    



}

function viewData(dataIndex) {

    var data = productResult.docs[dataIndex]
    console.log(data)
    var colorHEX = data.urunPhotos.colorHEX
    var urunPhotosHTML = '<div class="col">'
    var imgHTML = ''


    for (let index = 0; index < data.urunPhotos.length; index++) {
        const photoElement = data.urunPhotos[index];

        var theImage = new Image();
        theImage.src = photoElement.coloredPreviewPath;
        var xVote = 0;
        var yVote = 0;
        console.log(theImage.style.width)
        console.log(theImage.style.height)
        if(theImage.naturalWidth == 580){

            xVote ++;
        }
        else if(theImage.naturalHeight == 460){
            
            yVote ++;
        }
        else{
            console.log("YOUR PHOTO GOES ERR")
        }
    }


    if(xVote > yVote){ 

        isyVoteBigger = false;
    
    }else if (xVote < yVote){
    
        isyVoteBigger = true;
    
    }else{
    
        console.log("esit votelar tekrar seçime gidilecek")

    }
    

    for (let index = 0; index < data.urunPhotos.length; index++) {
        const element = data.urunPhotos[index];


        if (element.coloredPreviewPath) {
            imgHTML = '<img src=" ' + element.coloredPreviewPath + '  "  width="500" height="600"></img>'
        } else {
            imgHTML = 'No Image'
            
        }
        urunPhotosHTML += '<a id="hexColorButton" onclick="onColorClick('+dataIndex+','+index+')"><span class="dot" aria-hidden="true" style="background-color:#' + element.colorHEX + ';" data-toggle="tooltip" data-placement="top" title="' + element.colorName + ' #' + element.colorHEX + ' (click to copy)"></span></a>'
                    

    }
    urunPhotosHTML += '</div>'


    

    showModal('viewDataModal' + (dataIndex + 1), 'viewDataModal' + (dataIndex + 1), 'modal-lg', `<p><b>` + data.urunName + ` Özellikleri</b></p>`,
        `
        <style>
        #ThumbnailImg{
            display: block;
            margin-left: auto;
            margin-right: auto
        },    
        #hexColorButton:onclick{

        }
        </style>    
        
        <form class="bg-light">
                <div class="text-center">
                    <table class="table table-bordered ">
                        <thead>
                            <tr>
                                <th scope="col">Ürün İsmi</th>
                                <th scope="col">Kategori</th>
                                <th scope="row">Renk</th>
                            </tr>
                        </thead>
                        <tbody>
                            <td>`+data.urunName+`</td>
                            <td>`+data.urunType+`</td>
                            <th>`+urunPhotosHTML+`</th>
                        </tbody>
                    </table>
                    <a data-toggle="collapse" onclick="ChangeIconFunc()" href="#ShowImageCollapse" role="button">
                        <i class="far fa-plus-square fa-2x" id="icon"></i>
                    </a>
                    <div id="ShowImageCollapse" class="collapse">
                        <img id="ThumbnailImg" src="../../assets/img/`+data.urunPhotos[0].coloredPreviewPath+`" ></img>
                    </div>
                </div>   
            </form>
                
        `
        , '')




}

async function addProduct() {



    var categoryHTML = ""

    for (let index = 0; index < categoriesResult.length; index++) {
        const element = categoriesResult[index];

        categoryHTML += "<option>" + element.kategoriName + "</option>"
    }

    showModal('addProductModal', 'addProductModalLabel', 'modal-lg', 'Add New Product',
        `<form class='was-validated'>
        <div class="form-row">
            <div class="input-group mb-3">
                <div class="input-group-prepend">
                    <label class="input-group-text" for="categorySelector">Category</label>
                </div>
                <select class="custom-select" id="categorySelector" onchange="selectValidation()">
                    <option selected>Choose...</option>
                    `+ categoryHTML + `
                </select>
            </div>
        </div> 
        <div class="form-row">
            <div class="input-group mb-3">
                <div class="input-group-prepend">
                    <label class="input-group-text" for="urunNameProduct">Ürün Adı</label>
                </div>
                <input type="text" required  class="form-control" id="urunNameProduct" placeholder="Lütfen Ürün Adı Girin">
            </div>
        </div>
        
        <div class="form-row">
            <h3>Colors</h3>
            <a data-toggle="collapse"  href="#addNewColorCollapse" role="button">
                <i class="fas fa-plus fa-2x "id="plusIco" ></i>
            </a>
        </div>

        <div id="addNewColorCollapse" class="collapse">
            <div class="card card-body col" style="margin-top:15px">
                <div class="form-row">
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <span class="input-group-text">Hex Code</span>
                            </div>
                            <input type="text" class="form-control" id="hexColorId" pattern="(?:[0-9a-fA-F]{3}){1,2}" required placeholder="Hex Code">
                            <input type="text" class="form-control" id="colorNameId" required placeholder="Color Name">
                            <div class="input-group-prepend">
                                <span class="input-group-text" >Color Name</span>
                            </div>
                        </div>    
                    </div>
                    <div class="form-row" style="padding-top:15px">
                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text">Upload</span>
                            </div>
                            <div class="custom-file">
                                <input type="file" name="fileColorName" accept=".png,.jpg,.jpeg,."  class="custom-file-input" id="fileColorId" required>
                                <label class="custom-file-label" >Choose file</label>
                            </div>
                        </div>
                    </div>
                    <button type="button" class="btn btn-success" onclick="addNewColor()">Renk Ekle</button>
                </div>
        </div>
        <div>
            <table class="table table-bordered" >
                <thead>
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col">Resim Yolu</th>
                    <th scope="col">Renk Ismi</th>
                    <th scope="col">HEX Kodu</th>
                    </tr>
                </thead>
                <tbody id="productColorTableId">
                    
                </tbody>
            </table>
            
        </div>

    </form>
    `, `
    <button type="button" class="btn btn-success" onclick="addProductReady()">Kaydet</button>
    <script type="application/javascript">
        $('input[type="file"]').change(function(e){
           
            console.log("file onChange Called")
            if(e.target.files[0] !== undefined){
                var fileName = e.target.files[0].name;
                
                console.log(urunFiles)

                $('.custom-file-label').html(fileName);
            }else{


                
                $('.custom-file-label').html("Choose File");
            }
            
        });
        selectValidation()
    </script>
    `, `()=>{
        apiData = {
            urunType: null,
            urunName: null,
            urunPhotos: [],
            colorFiles: []
        }
        urunFiles = []
    }`)


}

function selectValidation() {
    if (document.getElementById('categorySelector').selectedIndex == 0) {
        document.getElementById('categorySelector').setCustomValidity('Please Select Category')
    } else {
        document.getElementById('categorySelector').setCustomValidity('')
    }
}

function hexKeyUpCheck() {
    var hexCheckedInputElement = document.getElementById('hexColorId');
    var hexCheckedInput = document.getElementById('hexColorId').value;
    if (hexCheckedInput.include(' ')) {
        hexCheckedInputElement.setCustomValidation("Can't include space/tab");
        return;
    }
    if (hexCheckedInput.include('#')) {
        hexCheckedInputElement.setCustomValidation("Can't include #");
        return;
    }
    if (hexCheckedInput.length < 3 && hexCheckedInputElement > 6) {
        hexCheckedInputElement.setCustomValidation("Can't be bigger than 6 / lower than 3");
        return;
    }
    


}

function addNewColor() {

    var hexColorElement = document.getElementById('hexColorId');
    var colorNameElement = document.getElementById('colorNameId');
    var coloredImageElement = document.getElementById('fileColorId');

    if (!(hexColorElement.checkValidity() &&
        colorNameElement.checkValidity() &&
        coloredImageElement.checkValidity())) {

        hexColorElement.reportValidity()
        colorNameElement.reportValidity()
        coloredImageElement.reportValidity()

        return;
    }




    var hexColor = document.getElementById("hexColorId");
    var colorName = document.getElementById("colorNameId");
    var coloredImage = document.getElementById("fileColorId");
    $("#productColorTableId").append(
        `<tr>    
                <td>`+ (ColorAdded + 1) + `</td>
                <td>`+ coloredImage.files[0].name + `</td>
                <td>`+ colorName.value + `</td>
                <td>`+ hexColor.value + `</td>
        </tr>`
    )
    

    var colorData = {
        colorHEX: hexColor.value,
        colorName: colorName.value,
        colorPhoto:coloredImage.files[0].name
    };
    apiData.urunPhotos[ColorAdded] = colorData;
    apiData.colorFiles[ColorAdded] = coloredImage.files[0]
    ColorAdded++

    urunFiles.push(coloredImage.files[0])
    console.log(urunFiles)

    hexColor.value = ""
    colorName.value = ""
    coloredImage.value = ""

    $('#hexColorId').trigger('change')
    $('#colorNameId').trigger('change')
    $('#fileColorId').trigger('change')



}

function addProductReady() {

    closeModal('addProductModal')
    var Name = document.getElementById('urunNameProduct')
    var categorySelector = document.getElementById('categorySelector')
    

    if(!(Name.checkValidity() && categorySelector.checkValidity())){
        Name.reportValidity()
        categorySelector.reportValidity()
        console.log("Validity Return")
        return;
    }


    var formData = new FormData()


    for (let index = 0; index < apiData.colorFiles.length; index++) {
        const Element = apiData.colorFiles[index]
        formData.append('files',Element)
    }
    
    var jsonPhotos = JSON.stringify(apiData.urunPhotos) 
    apiData = {

        urunType: null,
        urunName: null,
        urunPhotos: [],
        colorFiles: []
    }
    console.log(jsonPhotos)
    $.ajax({
        url: '/api/products',
        headers:{
            "name": Name.value,
            "category":categorySelector.selectedIndex - 1,
            "urunPhotos":jsonPhotos
        },
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (data) {
            console.log(data)
            if(data){
                ReqUser()
            }else{
                console.log("NO DATA FROM ADDED DURING PROCESS")
                alert("NO DATA FROM ADDED DURING PROCESS")
            }
        },
        error: (error)=>{
            console.log(error)
        }

    });




}

function colorNameKeyUpCheck() {
    var colorNameInput = document.getElementById('colorNameId').value;
    var colorNameInputElement = document.getElementById('colorNameId');
    if (colorNameInput <= 0) {
        colorNameInputElement.setCustomValidation("Can't be empty");
    }

}

function validateAddProduct() {
    var hexColorInput = document.getElementById('hexColorId').val();
    var colorNameInput = document.getElementById('colorNameId').val();

    if (!(hexColorInput.checkValidity() &&
        colorNameInput.checkValidity())) {

        hexColorInput.reportValidity()
        colorNamInput.reportValidity()
    }


}

function editData(dataIndex) {
    var data = productResult.docs[dataIndex] 

    var categoryHTML = ""
    var colorHTML = ""
    var stockUrunName = data.urunName;
    for (let index = 0; index < categoriesResult.length; index++) {
        const element = categoriesResult[index];
        
        if(data.urunType == index){
            categoryHTML += "<option selected>" + element.kategoriName + "</option>"
        }else{
            categoryHTML += "<option>" + element.kategoriName + "</option>"
        }
        
    }
    for (let index = 0; index < data.urunPhotos.length; index++) {
        const element = data.urunPhotos[index];
        
        colorHTML += `
            <tr>    
                <td>`+ (index + 1) + `</td>
                <td>
                    `
                    + element.coloredShowcasePath + 
                    `
                    <a onclick="editDataViewPhoto(`+dataIndex+`,`+index+`)" class="float-right"><i class="fas fa-eye"></i></a>
                </td>
                <td>`+ element.colorName+ `</td>
                <td>`+ element.colorHEX + `</td>
            </tr>
        `
    }
   
    


    showModal("editProductModal" + (dataIndex + 1), "editProductModalLabel" + (dataIndex + 1), 'modal-lg', 'Edit '+ data.urunName,
    `
    <form>  
        <div class="input-group mb-3">
            <div class="input-group-prepend">
                <span class="input-group-text" id="inputGroup-sizing-default">Ürün İsmi</span>
            </div>
            <input type="text" class="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default" value="`+stockUrunName+`">
        </div>
    
        <div class="input-group mb-3">
            <div class="input-group-prepend">
                <label class="input-group-text" for="inputGroupSelect01">Kategori</label>
            </div>
            <select class="custom-select" id="categorySelector" onchange="selectValidation()">
                `+categoryHTML+`
            </select>
        </div>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Resim Yolu</th>
                    <th scope="col">Renk Ismi</th>
                    <th scope="col">HEX Kodu</th>
                </tr>
            </thead>
            <tbody id="productColorTableId">
               
                    
                `+colorHTML+`
                    
                
            </tbody>
        </table>
        <div id="ShowImageCollapse" class="collapse">
            <img id="ThumbnailImg" src="../../assets/img/`+data.urunPhotos[0].coloredPreviewPath+`" ></img>
        </div>
        
    </form>
    `, '<button type="button" class="btn btn-success" onclick="editProductSave('+dataIndex+')">Kaydet</button>',
     '' )
    


}

function editDataViewPhoto(dataIndex,photoIndex){
    var data = productResult.docs[dataIndex]
    var dataPhoto = data.urunPhotos[photoIndex]
    
    var ThumbnailImgUsage = document.getElementById("ThumbnailImg");
    

    if (editDataCollapseIsOpen){

        

        if(lastEditDataCollapseDatas === [dataIndex,photoIndex]){
            $('#ShowImageCollapse').collapse('hide');
            editDataCollapseIsOpen = false;
        }else{
            ThumbnailImgUsage.style.transitionDuration= "0.5s"
            ThumbnailImgUsage.style.opacity = 0;
        
            ThumbnailImgUsage.addEventListener('transitionend', () => {
        
                ThumbnailImgUsage.src = '../../assets/img/'+dataPhoto.coloredPreviewPath;    
            });
        
            ThumbnailImgUsage.addEventListener('load', () => {
                
                ThumbnailImgUsage.style.opacity = 1;
            });
        }

        //eger onceki basilan tus ile ayni ise kapat
        //animasyon ekle ve bekle 
        //animasyon bittiginde fotografi degistir
        //fotograf yuklendiginde animasyonu kaldir
        
    }else{
        
        //animasyon ekle ve bekle 
        //animasyon bittiginde fotografi degistir
        //fotograf yuklendiginde animasyonu kaldir
        

        ThumbnailImgUsage.style.transitionDuration= "0.5s"
        ThumbnailImgUsage.style.opacity = 0;

        ThumbnailImgUsage.addEventListener('transitionend', () => {
        
            ThumbnailImgUsage.src = '../../assets/img/'+dataPhoto.coloredPreviewPath;    
        });
    
        ThumbnailImgUsage.addEventListener('load', () => {
            $('#ShowImageCollapse').collapse('show');
            editDataCollapseIsOpen = true;
            ThumbnailImgUsage.style.opacity = 1;
        });

    }

    
}

function editProductSave(dataIndex){
    

    
}



function deleteData(dataIndex) {
    showModal('deleteDataModal' + (dataIndex + 1), 'deleteDataModal' + dataIndex, '', '#' + dataIndex + '\' delete.',
        `
        Emin misin gardaşım
    `, `<button type="button" class="btn btn-primary" onclick="deleteDataFromDB('` + dataIndex + `')" data-dismiss="modal">Evet</button>`, '')
}

function deleteDataFromDB(dataIndex) {

    const data = productResult.docs[dataIndex]
    $.ajax(
        {
            url:"/api/products",
            type:"DELETE",
            data:{deletedProductId: data._id},
            success:(data)=>{
                console.log(data)
                if(data){
                    closeModal('deleteDataModal' + (dataIndex + 1))
                    ReqUser()
                }else{
                    console.log("NO DATA FROM DELETE PROCESS")
                }

            } 
        }
    )
}








function showModal(id, modelLabelId, modalSize, modelTitle, modelBody, modelFooter, onCloseCB) {
    $('#modals').empty()
    $('#modals').append(`
    <div class="modal fade " id="`+ id + `" tabindex="-1" role="dialog" aria-labelledby="` + modelLabelId + `" aria-hidden="false">
        <div class="modal-dialog `+ modalSize + `" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="`+ modelLabelId + `">` + modelTitle + `</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                `+ modelBody + `
                </div>
                <div class="modal-footer">
                `+
        modelFooter
        + `
                <button type="button" class="btn btn-secondary" onclick="closeModal('`+ id + `',` + onCloseCB + `)" data-dismiss="modal">Kapat</button>
                </div>
            </div>
        </div>
    </div>
    `)
    $('#' + id).modal('show')
    $('#' + id).on('hidden.bs.modal', (err) => {
        $('#' + id).remove()
        ColorAdded = 0
    })
}

function closeModal(id, CB) {
    ColorAdded = 0
    $('#' + id).modal('hide')
    $('#' + id).on('hidden.bs.modal', (err) => {
        $('#' + id).remove()
        ColorAdded = 0
    })
    try { CB() } catch { }
}