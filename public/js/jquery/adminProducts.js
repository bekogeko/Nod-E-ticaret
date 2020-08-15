const userTableLimit = 2
var productResult;
var categoriesResult;
var apiData = {

    urunType:null,
    urunName:null,
    urunPhotos:[],
    colorFiles:[]
}
var ColorAdded = 0
var urunFiles = []




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

function viewData(dataIndex) {

    var data = productResult.docs[dataIndex]
    console.log(data)

    var urunPhotosHTML = '<div class="col">'
    var imgHTML = ''

    for (let index = 0; index < data.urunPhotos.length; index++) {
        const element = data.urunPhotos[index];


        if (element.coloredProductPath) {
            imgHTML = '<img src=" ' + element.coloredProductPath + '  "  width="500" height="600"></img>'
        } else {
            imgHTML = 'No Image'
        }
        urunPhotosHTML += `
        <a onclick="copyToClipboard(\'#` + element.colorHEX + `\')">
            <span class="dot" aria-hidden="true" style="background-color:#` + element.colorHEX + `;"
             data-toggle="tooltip" data-placement="top" title="`+ element.colorName + ` #` + element.colorHEX + ` (click to copy)">
            </span>
        </a>`

    }
    urunPhotosHTML += '</div>'



    showModal('viewDataModal' + (dataIndex + 1), 'viewDataModal' + (dataIndex + 1), 'modal-lg',`<p><b>`+ data.urunName + ` Özellikleri</b></p>`,
        `    
            
            
            <form id="edit" class ="bg-light">
              
            
                <div class="row">
                    <div class="col">
                    <p> <b> Urun Renkleri: </b> </p>
                    <div> `+ urunPhotosHTML + ` </div>    
                    </div>
                    <div class="col">
                        <p><b>Urun Kategorisi :</b></p>
                        <div>`+ data.urunType + `</div>
                    </div>
                    <div class="col">
                        <p><b>Urun Adı:</b></p>
                        <div> `+ data.urunName + ` </div>
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
            <a  data-toggle="collapse"  href="#addNewColorCollapse" role="button">
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
    `,`()=>{

        urunFiles = null
    }`)


}

function selectValidation(){
    if(document.getElementById('categorySelector').selectedIndex == 0 )
    {
        document.getElementById('categorySelector').setCustomValidity('Please Select Category')
    }else{
        document.getElementById('categorySelector').setCustomValidity('')
    }
}
function hexKeyUpCheck(){
    var hexCheckedInputElement = document.getElementById('hexColorId');
    var hexCheckedInput =  document.getElementById('hexColorId').value;
    if(hexCheckedInput.include(' ')){
        hexCheckedInputElement.setCustomValidation("Can't include space/tab");
        return;
    }
    if(hexCheckedInput.include('#')){
        hexCheckedInputElement.setCustomValidation("Can't include #");
        return;
    }
    if(hexCheckedInput.length < 3 && hexCheckedInputElement > 6){
        hexCheckedInputElement.setCustomValidation("Can't be bigger than 6 / lower than 3");
        return;
    }
    
    
}


function addNewColor() {

    var hexColorElement = document.getElementById('hexColorId');
    var colorNameElement =  document.getElementById('colorNameId');
    var coloredImageElement =  document.getElementById('fileColorId');

    if(!(hexColorElement.checkValidity()&&
        colorNameElement.checkValidity()&&
        coloredImageElement.checkValidity())){
        
        hexColorElement.reportValidity()
        colorNameElement.reportValidity()
        coloredImageElement.reportValidity()

        return;
    }




    var hexColor = document.getElementById("hexColorId").value;
    var colorName = document.getElementById("colorNameId").value;
    var coloredImage = document.getElementById("fileColorId");
    $("#productColorTableId").append(
        `<tr>    
                <td>`+ (ColorAdded + 1 ) +`</td>
                <td>`+ coloredImage.files[0].name +`</td>
                <td>`+ colorName +`</td>
                <td>`+ hexColor +`</td>
        </tr>`
    )
    urunFiles.push(coloredImage.files[0])
    
    var colorData={
        colorHEX: hexColor,
        colorName: colorName
    };
    apiData.urunPhotos[ColorAdded] = colorData;
    apiData.colorFiles[ColorAdded] = coloredImage.files[0]
    ColorAdded++



}


function addProductReady(){
    apiData.urunType = document.getElementById('categorySelector').selectedIndex -1
    apiData.urunName = document.getElementById('urunNameProduct').value
    
    console.log(apiData)
    $.ajax({

        type: "POST",
        url: "/api/products",
        processData: false,
        contentType: false,

        data: apiData,
        success: function (result) {
            categoriesResult = result
        }


    });
    
}

function colorNameKeyUpCheck(){
    var colorNameInput = document.getElementById('colorNameId').value;
    var colorNameInputElement = document.getElementById('colorNameId');
    if(colorNameInput <=0){
        colorNameInputElement.setCustomValidation("Can't be empty");
    }

}
    
function validateAddProduct(){
    var hexColorInput = document.getElementById('hexColorId').val();
    var colorNameInput = document.getElementById('colorNameId').val();
    
    if(!(hexColorInput.checkValidity() && 
       colorNameInput.checkValidity())){
        
        hexColorInput.reportValidity()
        colorNamInput.reportValidity()
    }


}


function editData(dataindex) {
    showModal("constructionModal" + (dataindex + 1), "constructionLabelModal" + (dataindex + 1), '', 'Under Construction', '<p>Under Construction</p>', '','','')
}



function deleteData(dataIndex) {
    showModal('viewDataModal' + (dataIndex + 1), 'viewDataModal' + dataIndex, '', '#' + dataIndex + '\' delete.',
        `
        Emin misin gardaşım
    `, `<button type="button" class="btn btn-primary" onclick="deleteDataFromDB('` + dataIndex + `')" data-dismiss="modal">eVt</button>`,'')
}

function deleteDataFromDB(dataIndex) {

    const data = productResult.docs[dataIndex]
    console.log(data)
    ReqUser()
}








function showModal(id, modelLabelId, modalSize, modelTitle, modelBody, modelFooter,onCloseCB) {
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
                <button type="button" class="btn btn-secondary" onclick="closeModal('`+ id + `',`+onCloseCB+`)" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
    `)
    $('#' + id).modal('show')
    $('#' + id).on('hidden.bs.modal', (err) => {
        $('#' + id).remove()
    })
}

function closeModal(id,CB) {
    ColorAdded = 0 
    $('#' + id).modal('hide')
    $('#' + id).on('hidden.bs.modal', (err) => {
        $('#' + id).remove()
    })
    try {CB()}catch {}
}

