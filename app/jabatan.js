function reset_form(){
    $("#txdepartment").val('').focus();
    $("#txatasan").val('');
    $("#txcode").val('');
    $("#txname").val('');
  }
  
  function load_data() {
    $.post("jabatan/load_data",
      {
  
      },
      function (data) {
        console.log(data)
        $("#table2").DataTable().clear().destroy()
        $("#table2 > tbody").html('');
        $.each(data.jabatan, function (idx, val) {
          html = '<tr>'
          html += '<td>' + val['departmentName'] + '</td>'
          html += '<td>' + val['kode'] + '</td>'
          html += '<td>' + val['nama'] + '</td>'
          html += '<td>' + val['atasan'] + '</td>'
          html += '<td><span onclick="active_data(' + val['employmentId'] + ',' + val['employmentActive'] + ')" class="badge ' + ((val['employmentActive'] == '1') ? 'bg-success' : 'bg-danger') + ' ">' + ((val['employmentActive'] == '1') ? 'Active' : 'Inactive') + '</span></td>'
          html += '<td><button class="btn btn-warning btn-sm btn-edit"  onclick="edit_data(' + val['employmentId'] + ')">Edit</button></td>'
          html += '<td><button class="btn btn-danger btn-sm " onclick="hapus_data(' + val['employmentId'] + ')">Hapus</button></td>'
          html += '</tr>'
          $("#table2 > tbody").append(html);
        });
  
        $("#table2").DataTable({
          responsive: true,
          processing: true,
          pagingType: 'first_last_numbers',
          // order: [[0, 'asc']],
          dom:
            "<'row'<'col-3'l><'col-9'f>>" +
            "<'row dt-row'<'col-sm-12'tr>>" +
            "<'row'<'col-4'i><'col-8'p>>",
          "language": {
            "info": "Page _PAGE_ of _PAGES_",
            "lengthMenu": "_MENU_",
            "search": "",
            "searchPlaceholder": "Search.."
          }
        });
  
      }, 'json');
  }
  
  function load_divisi() {
    $.post('jabatan/loadDivisi', function (res) {
      $("#txdepartment, #txatasan").empty()
  
      $("#txdepartment").append('<option value = "">Pilih Divisi</option>')
      $("#txatasan").append('<option value = "">Pilih Atasan</option>')
  

      $.each(res.data_department, function (i, v) {
        $("#txdepartment").append('<option value = "' + v.departmentId + '">' + v.departmentName + '</option>')
      }
      )
      $.each(res.data_atasan, function (i, v) {
        $("#txatasan").append('<option value = "' + v.employmentId + '">' + v.atasan + '</option>')
      }
      )
    }, 'json');
  }

  function loadAtasan(id){
    $.post('jabatan/loadDivisi',{id:id}, function (res) {
      $("#txatasan").empty()
  
      $("#txatasan").append('<option value = "">Pilih Atasan</option>')
  

      $.each(res.data_atasan, function (i, v) {
        $("#txatasan").append('<option value = "' + v.employmentId + '">' + v.atasan + '</option>')
      }
      )
    }, 'json');
  }
  
  function simpan_data() {
    let code = $("#txcode").val();
    let name = $("#txname").val();
    let department = $("#txdepartment").val();
    let atasan = $("#txatasan").val();
  
    if (code === "" || name === "" || department === '') {
      Swal.fire({
        title: 'Error!',
        text: "Ada Form belum dimasukkan!!!",
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } else {
      $.post("jabatan/create", {
        txcode: code,
        txname: name,
        txdepartment: department,
        txatasan: atasan,
      },
        function (data) {
          console.log(data.status);
          if (data.status === "error") {
            Swal.fire({
              title: 'Error!',
              text: data.msg,
              icon: 'error',
              confirmButtonText: 'OK'
            });
          } else {
            Swal.fire({
              title: 'Success!',
              text: data.msg,
              icon: 'success',
              confirmButtonText: 'OK'
            });
            reset_form();
            
          }
        }, 'json');
    }
  }
  
  function update_data() {
    var id = $("#loginModal").data('id');
    let employmentDepartmentId = $("#txdepartment").val();
    let employmentParentEmploymentId = $("#txatasan").val();
    let employmentCode = $("#txcode").val();
    let employmentName = $("#txname").val();
  
    if (employmentDepartmentId === "" || employmentCode === "" || employmentName === "") {
      Swal.fire({
        title: 'Error!',
        text: data.msg,
        icon: 'error',
        confirmButtonText: 'OK'
      })
    } else {
      $.post('jabatan/update_table', { id: id, employmentDepartmentId: employmentDepartmentId, employmentParentEmploymentId: employmentParentEmploymentId, employmentName: employmentName, employmentCode: employmentCode}, function (data) {
        if (data.status === 'success') {
          Swal.fire({
            title: 'Success!',
            text: data.msg,
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            load_data();
            $("#loginModal").modal('hide');
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: data.msg,
            icon: 'error',
            confirmButtonText: 'OK'
          })
        }
      }, 'json');
    }
  }
  
  function edit_data(id) {
    $.post('jabatan/edit_table', { id: id }, function (data) {
        $("#txcode").val(data.data.employmentCode);
        $("#txname").val(data.data.employmentName);
  
        
        $.post('jabatan/loadDivisi', function(res) {
            $("#txdepartment").empty();
            $("#txdepartment").append('<option value="">Pilih Department</option>');
            $.each(res.data_department, function(i, v) {
                let selected = (v.departmentId == data.data.employmentDepartmentId) ? 'selected' : '';
                $("#txdepartment").append('<option value="'+v.departmentId+'" '+selected+'>'+v.departmentName+'</option>');
            });
        }, 'json');
  
      
        $.post('jabatan/loadDivisi', { id: data.data.employmentDepartmentId }, function(res) {
            $("#txatasan").empty();
            $("#txatasan").append('<option value="">Pilih Atasan</option>');
            $.each(res.data_atasan, function(i, v) {
                let selected = (v.employmentId == data.data.employmentParentEmploymentId) ? 'selected' : '';
                $("#txatasan").append('<option value="' + v.employmentId + '" ' + selected + '>' + v.atasan + '</option>');
            });
        }, 'json');
  
        $("#loginModal").data('id', id); 
        $("#loginModal").modal('show');
        $(".btn-submit").hide();
        $(".btn-editen").show();
    },  'json');
  }
  
  function hapus_data(id) {
    Swal.fire({
        title: 'Apakah kamu ingin menghapus data?',
        showDenyButton: true,
        showCancelButton: true,
        denyButtonText: 'No',
        confirmButtonText: 'Yes',
        customClass: {
            actions: 'my-actions',
            cancelButton: 'order-1 right-gap',
            confirmButton: 'order-2',
            denyButton: 'order-3',
        },
    }).then((result) => {
        if (result.isConfirmed) {
            $.post('jabatan/delete_table', { id: id }, function (data) {
                if (data.status === 'success') {
                    Swal.fire({
                        title: 'Succes!',
                        text: data.msg,
                        icon: 'success',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        load_data()
                    });
                } else {
                    Swal.fire({
                        title: 'Error!',
                        text: data.msg,
                        icon: 'error',
                        confirmButtonText: 'OK'
                    })
                }
            }, 'json');
        } else if (result.isDenied) {
            Swal.fire('Perubahan tidak tersimpan', '', 'info')
        }
    })
  }
  
  function active_data(id, status) {
    if (status == 1) {
      Swal.fire({
        title: 'Konfirmasi',
        text: 'Apakah Anda Ingin MENONAKTIFKAN data ini?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, Nonaktifkan',
        cancelButtonText: 'Batal'
      }).then((result) => {
        if (result.isConfirmed) {
          $.post('jabatan/active', { id: id }, function (data) {
            if (data.status === 'success') {
              Swal.fire({
                title: 'Success!',
                text: data.msg,
                icon: 'success',
                confirmButtonText: 'OK'
              }).then(() => {
                $("#loginModal").modal('hide');
                load_data();
              });
            } else {
              Swal.fire({
                title: 'Gagal!',
                text: data.msg,
                icon: 'error',
                confirmButtonText: 'OK'
              });
            }
          }, 'json');
        }
      });
    } else {
      Swal.fire({
        title: 'Konfirmasi',
        text: 'Apakah Anda Ingin MENGAKTIFKAN data ini?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, Aktifkan',
        cancelButtonText: 'Batal'
      }).then((result) => {
        if (result.isConfirmed) {
          $.post('jabatan/active', { id: id }, function (data) {
            if (data.status === 'success') {
              Swal.fire({
                title: 'Sukses!',
                text: data.msg,
                icon: 'success',
                confirmButtonText: 'OK'
              }).then(() => {
                $("#loginModal").modal('hide');
                load_data();
              });
            } else {
              Swal.fire({
                title: 'Gagal!',
                text: data.msg,
                icon: 'error',
                confirmButtonText: 'OK'
              });
            }
          }, 'json');
        }
      });
    }
  }
  
  
  $(document).ready(function () {
    $(".btn-closed").click(function () {
      reset_form()
    });
  
    $(".btn-add").click(function () {
      reset_form();
      $(".btn-submit").show();
      $(".btn-editen").hide();
    })
    $(".btn-add").click(function () {
      $(".btn-submit").show();
      $(".btn-editen").hide();
    })
    $(".page-title").html("Department")
    $(".tit").html("Department")
  
    load_data();
    load_divisi();
  });