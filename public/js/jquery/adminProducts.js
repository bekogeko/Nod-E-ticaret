const userTableLimit = 2
let productResult;


$(document).ready(ReqUser)

function ReqUser() {
    try {


        $.ajax({
            url: "/api/products",

            data: {
                queryLimit: 25

            },
            success: async function (result) {

                if (!result){throw new Error()}
                if (!result.docs){throw new Error()}


                $('#productsTable').empty()
                productResult = result
               

                for (let index = 0; index < result.AlldocCount; index++) {
                    
                    
                    const element = result.docs[index];
                    if (!element){throw new Error('element not found')}

                    var colorSchemeHTML = '';

                    await element.urunPhotos.forEach((colorElement) => {
                        colorSchemeHTML += '<a onclick="copyToClipboard(\'#' + colorElement.colorHEX + '\')"><span class="dot" aria-hidden="true" style="background-color:#' + colorElement.colorHEX + ';" data-toggle="tooltip" data-placement="top" title="'+ colorElement.colorName+' #'+colorElement.colorHEX+' (click to copy)"></span></a>'
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
                    <a onclick="editData('`+ index + `')" data-toggle="tooltip"><i
                        class="fas fa-pen edit"></i></a>
                    <a onclick="deleteData('`+ index + `')" data-toggle="tooltip"><i
                        class="fas fa-trash delete"></i></a>
                        </td>
                    <tr>`
                    );

                    $('#productsTableShowInfo').html(
                        `
                        Showing <b>`+ productResult.docs.length + `</b> out of <b>` + productResult.AlldocCount + `</b> entries
                        `
                    )

                }

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
    alert('Color hex code copied to clipboard!');
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    
}

function viewData(dataIndex) {

    var data = productResult.docs[dataIndex]
    console.log(data)

    var urunPhotosHTML = '<div class="col">'
    var imgHTML= ''
    
    for (let index = 0; index < data.urunPhotos.length; index++) {
        const element = data.urunPhotos[index];
        

        if(element.coloredProductPath){
            imgHTML = '<img src=" '+element.coloredProductPath+'  "  width="500" height="600"></img>'
        }else{
            imgHTML = 'No Image'
        }
        urunPhotosHTML +=  '<a onclick="copyToClipboard(\'#' + element.colorHEX + '\')"><span class="dot" aria-hidden="true" style="background-color:#' + element.colorHEX + ';" data-toggle="tooltip" data-placement="top" title="'+ element.colorName+' #'+element.colorHEX+' (click to copy)"></span></a>'


        /*`
        <div class="row">
            <div class="col">
                <p>`+imgHTML+`</p>
            </div>
            <div class="col">
                <p>`+element.colorHEX+`</p>
            </div>
            <div class="col">
                <p>`+element.colorName+`</p>
            </div>
        </div>
        `*/
    }
    urunPhotosHTML += '</div>'



    showModal('viewDataModal' + (dataIndex + 1), 'viewDataModal' + (dataIndex + 1), 'modal-lg', '#' + dataIndex + '\'s Details',
        `
            <form id="edit">
            
            <div class="row">
                <div class="col bg-light ">
                    
                </div>
                <div class="col">
                    <p><b>Urun Kategorisi : </b></p>
                    <div class="bg-light">`+data.urunType+`</div>
                </div>
            </div>   

                `+urunPhotosHTML+` 
               
                 
                
            
            </form>
        `
        , '')




}





function deleteData(dataIndex) {
    showModal('viewDataModal' + (dataIndex + 1), 'viewDataModal' + dataIndex, '', '#' + dataIndex + '\' delete.',
    `
        Emin misin gardaşım
    `, `<button type="button" class="btn btn-primary" onclick="deleteDataFromDB('` + dataIndex + `')" data-dismiss="modal">eVt</button>`)
}

function deleteDataFromDB(dataIndex) {

    const data = productResult.docs[dataIndex]
    console.log(data)
    ReqUser()
}


function addProductModal() {

    showModal('addProductModal', 'addProductModalTitle', 'modal-lg', 'Add Product', ``, ``)


}









function showModal(id, modelLabelId, modalSize, modelTitle, modelBody, modelFooter) {
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
                <button type="button" class="btn btn-secondary" onclick="closeModal('`+ id + `')" data-dismiss="modal">Close</button>
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

function closeModal(id) {
    $('#' + id).modal('hide')
    $('#' + id).on('hidden.bs.modal', (err) => {
        $('#' + id).remove()
    })
}

