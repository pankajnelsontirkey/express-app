$(document).ready(() => {
	$('.deleteUser').on('click', deleteUser);
});

function deleteUser() {
	let confirmation = confirm('Delete?');
	if (confirmation) {
		$.ajax({
			type: 'DELETE',
			url: '/users/delete/' + $(this).data('id')
		});
		window.location.replace('/');
	} else {
		return false;
	}
}
