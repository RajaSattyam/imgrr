# imgrr - Image Service with dynamic image resizing (Demo)

## Setup Guide

You can check out the set up guide for the project [here](https://github.com/abinavseelan/imgrr/wiki/Setup-Guide)

## Architecture

The architecture has been briefly explained [here](https://github.com/abinavseelan/imgrr/wiki/Architecture)

## Features

### Validate Image Size before upload

The image size is validated to check if it's 1024x1024. If it is not, the upload button is disabled. It also accepts only image files.

![disabled](https://user-images.githubusercontent.com/6417910/29496101-717e793e-85e9-11e7-9e07-ad0b887ce28e.gif)

### Upload an Image

Clicking on the `Upload` button will upload the image to [image-service](https://github.com/abinavseelan/imgrr/wiki/Architecture#image-service). On receiving the resource ID from image service, the ID is POST-ed to the [web-server](https://github.com/abinavseelan/imgrr/wiki/Architecture#web-server) and the UI is updated on success.

![uploadimage](https://user-images.githubusercontent.com/6417910/29496103-74aa9e26-85e9-11e7-8938-5a8c6c819d3d.gif)

### View Gallery of Cropped Images

Clicking on an image will load its gallery. The gallery will showcase all the cropped versions of the uploaded image. Here, every time you click on a size on the top, an image matching that size will be pulled from [image-service](https://github.com/abinavseelan/imgrr/wiki/Architecture#image-service).

You can also view the full sized image by clicking the `View Full Size` link at the bottom, which will open the cropped image in a new tab.

![croppedgallery](https://user-images.githubusercontent.com/6417910/29496102-72236638-85e9-11e7-8dcc-195fb8658fee.gif)

