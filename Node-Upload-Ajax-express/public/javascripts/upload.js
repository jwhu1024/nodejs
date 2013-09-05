$(document).ready(function() {

    status('Choose a file :)');

    $('#subtn').click(function() {
        if ($('#userPhotoInput').val() !== '') {
            $('#uploadForm').submit();
        }
    });

    $('#uploadForm').submit(function() {
        status('uploading the file ...');

        $(this).ajaxSubmit({
            error: function(xhr) {
                status('Error: ' + xhr.status);
            },

            success: function(response) {

                if (response.error) {
                    status('Opps, something bad happened');
                    return;
                }

                var imageUrlOnServer = response.path;
                status('Success, file uploaded to:' + imageUrlOnServer);
            }
        });

        // Have to stop the form from submitting and causing                                                                                                       
        // a page refresh - don't forget this                                                                                                                      
        return false;
    });

    function status(message) {
        $('#status').text(message);
    }
});