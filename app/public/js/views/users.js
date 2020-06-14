		
		function show(usersData){
			var i=1;
			var txt;
			$(".remove").remove();
			usersData.forEach((data)=>{
				txt += "<tr class = 'remove'><td>"+i+"</td>"+
				"<td>"+data.username+"</td>"+
				"<td>"+data.email+"</td>"+
				"<td>"+data.no+"</td>"+
				"<td>"+data.firstname+"</td>"+
				"<td>"+data.lastname+"</td>"+
				"<td>"+data.admin+"</td>"+
				"<td>"+
				"<div class='btn-group' role='group' aria-label='Basic example'>"+
					"<button class='btn btn-info' onclick = editBtn(`"+data.username+"`)>Edit</button>"+
				"</div>"+
				"</td></tr>"
				i++
			})
			$('.tableContent').after(txt)
		} 
		show(users)
		socket.on('users',(users)=>{
			var data=users
			show(data)

		})

		function editBtn(username){
			var user = users.filter(function (user) {return user.username == username})
			if(user.length==0){
				alert('Data tidak ada / lakukan reload halaman')
			} else{
				user = user[0]
				$("#inputUsername").val(user.username);
				$("#inputFirstname").val(user.firstname);
				$("#inputLastname").val(user.lastname);
				$("#inputEmail").val(user.email);
				$("#inputPass").val(user.password);
				$("#inputNohp").val(user.no);
				$('#editModal').modal('show');
			}
		}

		function save(action){
			var status = $("#inputStatus").val()
			status = ()=>{
				return status == 'true' ? true : false 
			}
			status = status()
			data= {
				'username' : $("#inputUsername").val(),
				'firstname' : $("#inputFirstname").val(),
				'lastname' : $("#inputLastname").val(),
				'email' : $("#inputEmail").val(),
				'no' : $("#inputNohp").val(),
				'pass' : $("#inputPass").val(),
				'admin' : status
				}

			console.log(data)
			
			saveBtn = (action)=>{
				socket.emit('editProfile', data )
			}
			saveBtn()
		}
