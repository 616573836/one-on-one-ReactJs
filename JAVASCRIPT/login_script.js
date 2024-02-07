$('#signup').click(function () {
    $('.box').css('transform', 'translateX(82%');
    $('.login').addClass('hidden');
    $('.signup').removeClass('hidden');
})

$('#signin').click(function () {
    $('.box').css('transform', 'translateX(0%');
    $('.signup').addClass('hidden');
    $('.login').removeClass('hidden');
})

document.addEventListener("DOMContentLoaded", function() {
    const submitButton = document.querySelector('.submitButton');
    if (submitButton) {
        submitButton.addEventListener('click', function() {
            window.location.href = '/HTML/Users/dashboard.html';
        });
    }
});


