const userTableLimit = 2
let requserResult;


$(document).ready(ReqUser)




function ReqUser() {
    $.ajax({
        url: "/api/requsers",

        data: {
            queryLimit: 25

        },
        success: function (result) {
            $('#requsersTable').empty()
            requserResult = result



            for (let index = 0; index < result.AlldocCount; index++) {
                const element = result.docs[index];

                $("#requsersTable").append(
                    `<tr>    
                        <td>`+ (index + 1) + `</td>
                        <td>`+ element.fullname + `</td>
                        <td>`+ element.email + `</td>
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

               

            } $('#reqUserTableShowInfo').html(
                `
                Showing <b>`+ result.docs.length + `</b> out of <b>` + result.AlldocCount + `</b> entries
                `
            )

        }
    });

}

function viewData(dataIndex) {

    var data = requserResult.docs[dataIndex]


    showModal('viewDataModal' + (parseInt(dataIndex) + 1), 'viewDataModal' + dataIndex, '', '#' + (parseInt(dataIndex) + 1) + '\'s Details',
        `

        <div class="row">
            <div class="col"><p style="font-weight: bold;">Fullname:</p></div>
            
            <div class="col">
               <p>` + data.fullname + `</p>
            </div>
            <div class="col"><p style="font-weight: bold;">Email:</p></div>
            
            <div class="col">
            <p>` + data.email + `</p>
            </div>
        </div>
        
        
        `, '')






}
function editData(dataIndex) {

    var data = requserResult.docs[dataIndex]


    showModal('editDataModal' + (parseInt(dataIndex) + 1), 'editDataModal' + dataIndex, 'modal-lg', '#' + (parseInt(dataIndex) + 1) + '\'s Details',
        `
        <form id='editForm' class="was-validated" novalidate>
            <div class="form-row" style="margin-bottom: 15px;">
                <div class="col">
                    <label for="editUserfullname">Full Name</label>
                    <input type="text" id="editUserfullname" class="form-control" placeholder="Full Name"  required value="`+ data.fullname + `">

                    <div class="valid-feedback">
                        Sorun Yok!
                    </div>
                    <div class="invalid-feedback">
                        Lutfen Gecerli bir kullanici adi girin
                    </div>
                </div>
                <div class="col">
                    <label for="editUserEmail">Email</label>
                    <input type="email" id="editUserEmail"class="form-control" placeholder="E-Mail" value="`+ data.email + `">
                    
                    <div class="valid-feedback">
                        Sorun Yok!
                    </div>
                    <div class="invalid-feedback">
                        Lutfen Gecerli bir E-Mail girin
                    </div>
                </div>
            </div>

            <div class="form-row" style="margin-bottom: 15px;">
                <div class="col">
                    <label >Password</label>
                    <input id="editUserPassword" type="text" class="form-control" placeholder="Password" onkeyup="equalityPassKeyUp()" >
                    <small class="form-text text-muted">Değiştirmek istemiyorsanız boş bırakın</small>
                    
                </div>
                <div class="col">
                    <label >Password Repeat</label>
                    <input id="editUserPasswordRepeat" type="text" class="form-control" placeholder="Password Repeat" onkeyup="equalityPassKeyUp()"  >
                    <div class="valid-feedback">
                        Sorun Yok!
                    </div>
                    <div class="invalid-feedback">
                        Lutfen sifreyi dogrulayin
                    </div>
                </div>
            </div>
        </form>
        `, `
                <button class="btn btn-success" onclick="editRequest(`+ dataIndex + `)">Kaydet</button>
                <button class=btn btn-warning" onclick="verifyRequest(`+ dataIndex + `)">Dogrula</button>

            `)
}

function equalityPassKeyUp() {

    console.log("called")
    var pass = document.getElementById('editUserPassword').value
    var passRepeat = document.getElementById('editUserPasswordRepeat').value
    
    
    
    if(pass.includes(' ')){
        document.getElementById('editUserPassword').setCustomValidity("Can't include space/tab ")
        document.getElementById('editUserPasswordRepeat').setCustomValidity("Can't include space/tab ")

        return;
    }
    if(passRepeat.includes(' ')){
        document.getElementById('editUserPasswordRepeat').setCustomValidity("Can't include space/tab ")
        document.getElementById('editUserPassword').setCustomValidity("Can't include space/tab ")

        return;
    }    

    if(pass === passRepeat){
        //limitation
        document.getElementById('editUserPasswordRepeat').setCustomValidity('')
        document.getElementById('editUserPassword').setCustomValidity('')
        return;
    }else{
        document.getElementById('editUserPasswordRepeat').setCustomValidity("Can't be different")
        document.getElementById('editUserPassword').setCustomValidity("Can't be different")

        return;
    }

    

}


function editRequest(dataIndex) {

    userEmailForm = document.getElementById('editUserEmail')
    userFullName = document.getElementById('editUserfullname')
    userPassword = document.getElementById('editUserPassword')
    userPasswordRepeat = document.getElementById('editUserPasswordRepeat')


    if(!(userEmailForm.checkValidity()&&
        userFullName.checkValidity()&&
        userPassword.checkValidity()&&
        userPasswordRepeat.checkValidity()) ){
           
        userEmailForm.reportValidity()
        userFullName.reportValidity()
        userPassword.reportValidity()
        userPasswordRepeat.reportValidity()
        return;
    }


    datauser = requserResult.docs[dataIndex]


    data = {}

    data.editedUserId = datauser._id

    data.password = (userPassword.value && userPasswordRepeat.value)

    if (data.password === '') {
        delete data.password
    }


    if (userFullName.value !== datauser.fullname) {
        data.fullname = userFullName.value
    }
    if (userEmailForm.value !== datauser.email) {
        data.email = userEmailForm.value
    }




    if (Object.keys(data).toString() === "editedUserId"){
        console.log('only id ___---___ No Request ')
        closeModal('editDataModal' + (parseInt(dataIndex) + 1))
        return;
    }

    
    $.ajax({
        type: "PUT",
        url: "/api/edituser",
        data: data,
        success: (result) => {
            
            if(result.nModified === result.ok){
                console.log("Succesfuly Edited Data at Index "+(dataIndex+1))
            }else{
                console.error("Error!!  ",result)
            }
            ReqUser()
            closeModal('editDataModal' + (parseInt(dataIndex) + 1))


        }
    })
}

function verifyRequest(dataIndex){

    datauser = requserResult.docs[dataIndex]


    data = {}

    data.verifiedUserId = datauser._id



    console.log(datauser)

    $.ajax({
        type: "PUT",
        url: "/api/verifyuser",
        data: data,
        success: (result) => {
            
            if(result.nModified === result.ok){
                console.log("Succesfuly Verified Data at Index "+(dataIndex+1))
            }else{
                console.error("Error!! ",result)
            }
            
            ReqUser()
            closeModal('editDataModal' + (parseInt(dataIndex) + 1))


        }
    }
    )
}

function deleteData(dataIndex) {
    showModal('deleteDataModal' + (parseInt(dataIndex) + 1), 'viewDataModal' + dataIndex, 'modal-lg', '#' + (parseInt(dataIndex) + 1) + '\' delete.',
    `
    Emin misin gardaşım
    `, `<button type="button" class="btn btn-primary" onclick="deleteDataFromDB('` + dataIndex + `')" data-dismiss="modal">evt</button>`)
}

function deleteDataFromDB(dataIndex) {

    const data = {}
    data.deletedUserId  = requserResult.docs[dataIndex]._id

    $.ajax({
        type: "DELETE",
        url: "/api/deluser",
        data: data,
        success: (result) => {
            
            if(result.nModified === result.ok){
                console.log("Succesfuly deleted Data at Index "+(dataIndex+1))
            }else{
                console.error("Error!!  ",result)
            }
            ReqUser()
            closeModal('deleteDataModal' + (parseInt(dataIndex) + 1))
            

        }
    })




    ReqUser()
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

