const { PostPagePhotoMediaRequest, PostPublishMediaRequest } = require("instagram-graph-api");

const waitUntil = (condition) => {
    return new Promise((resolve) => {
        let interval = setInterval(() => {
            if (!condition())
                return

            clearInterval(interval)
            resolve()
        }, 100)
    })
}

module.exports = {
    uploadtoInstagram: function(token, pageID, imageURL, imageCaption, callback, errorCallback) {
        let isLoading = true;
        let errorHappened = false;
        let errorString = "Not init";
        const request = new PostPagePhotoMediaRequest(
            token,
            pageID,
            imageURL,
            imageCaption
        );
        request.execute().then((response) => {
            errorString = response;
            if(response.data.id) {
                const igRequest = new PostPublishMediaRequest(
                    token,
                    pageID,
                    response.data.id
                );
        
                igRequest.execute().then((igResponse) => {
                    isLoading = false;
                }).catch(() => { isLoading = false; errorHappened = true; });
            } else {
                errorHappened = true;
                isLoading = false;
            }
        }).catch((err) => {
            isLoading = false;
            errorHappened = true;
            errorString = err;
        });
        waitUntil(() => isLoading === false).then(() => { errorHappened ? errorCallback(errorString) : callback() });
    }
 }