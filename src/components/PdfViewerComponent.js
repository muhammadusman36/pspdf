// implementation of drag and drop in web

import React, { useEffect, useRef, useCallback } from "react";
import PSPDFKit from "pspdfkit";

export default function PdfViewerComponent(props) {
    const containerRef = useRef(null);
    const dropzoneRef = useRef(null);
    const instance = useRef(null);
    const PSPDFKit = useRef(null);

    useEffect(() => {
        const container = containerRef.current;

        (async function () {
            PSPDFKit.current = await import("pspdfkit");
            instance.current = await PSPDFKit.current.load({
                container,
                document: props.document,
                baseUrl: `${window.location.protocol}//${window.location.host}/`,
                theme: PSPDFKit.current.Theme.DARK,
            });
        })();

        return () => PSPDFKit.current && PSPDFKit.current.unload(container);
    }, []);

    const handleDragStart = useCallback(
        (ev) => {
            if (!dropzoneRef.current) return;

            dropzoneRef.current.classList.add("drag-over");
            ev.dataTransfer.setData("text/plain", ev.target.src);
        },
        [dropzoneRef.current]
    );

    const handleDrop = useCallback(
        (ev) => {
            if (!PSPDFKit.current || !instance.current) return;

            (async function () {
                ev.preventDefault();
                // Get the id of the target and add the moved element to the target's DOM
                const img = ev.dataTransfer.getData("text/plain");

                const image = await fetch(img);
                const blob = await image.blob();

                const imageAttachmentId = await instance.current.createAttachment(blob);
                const pointInPage = await instance.current.transformClientToPageSpace(
                    new PSPDFKit.current.Geometry.Point({
                        x: ev.clientX,
                        y: ev.clientY,
                    }),
                    instance.current.viewState.currentPageIndex
                );

                const annotation = new PSPDFKit.current.Annotations.ImageAnnotation({
                    pageIndex: instance.current.viewState.currentPageIndex,
                    contentType: "image/jpeg",
                    imageAttachmentId,
                    description: "Example Image Annotation",
                    boundingBox: new PSPDFKit.current.Geometry.Rect({
                        left: pointInPage.x - 100,
                        top: pointInPage.y - 70,
                        width: 200,
                        height: 135,
                    }),
                });

                await instance.current.create(annotation);
                dropzoneRef.current.classList.remove("drag-over");
            })();
        },
        [
            dropzoneRef.current,
            instance.current,
            PSPDFKit.current,
        ]
    );

    return (
        <div>
            <div className="images">
                <img
                    onDragStart={handleDragStart}
                    draggable="true"
                    src="https://source.unsplash.com/6w3hF2r9gqk/300x200"
                />
                <img
                    onDragStart={handleDragStart}
                    draggable="true"
                    src="https://source.unsplash.com/vuOxADFnnQ4/300x200"
                />
                <img
                    onDragStart={handleDragStart}
                    draggable="true"
                    src="https://source.unsplash.com/kYIrsmX3YIA/300x200"
                />
                <img
                    onDragStart={handleDragStart}
                    draggable="true"
                    src="https://source.unsplash.com/7S9k69vO8ZY/300x200"
                />
                <img
                    onDragStart={handleDragStart}
                    draggable="true"
                    src="https://source.unsplash.com/HQL-zncwP34/300x200"
                />
            </div>
            <div
                onDrop={handleDrop}
                onDragOver={(ev) => {
                    ev.preventDefault();
                }}
            >
                <div ref={dropzoneRef}>
                    <div
                        ref={containerRef}
                        style={{
                            height: "calc(100vh - 165px)",
                            backgroundColor: "#4d525d",
                        }}
                    />
                </div>
            </div>

            <style global jsx>
                {`
          * {
            margin: 0;
            padding: 0;
          }

          .drag-over {
            pointer-events: none;
          }
        `}
            </style>

            <style jsx>{`
        .images {
          padding: 15px;
          background-color: #f5f5f5;
          border-bottom: 1px solid #444;
          display: flex;
          flex-direction: row;
          gap: 15px;
        }

        .images img {
          width: 200px;
          border-radius: 4px;
          cursor: move;
          box-shadow: 0px 1px 1px 1px #6868682e;
        }
      `}</style>
        </div>
    );
}


// changing input types bg color


// import React, { useEffect, useRef } from "react";
// import PSPDFKit from "pspdfkit";

// export default function PdfViewerComponent(props) {
//     const containerRef = useRef(null);
//     let instance = null;

//     useEffect(() => {
//         const container = containerRef.current;

//         const initializePSPDFKit = async () => {
//             try {

//                 instance = await PSPDFKit.load({
//                     container,
//                     document: props.document,
//                     styleSheets: ['my_css.css'],
//                     baseUrl: `${window.location.protocol}//${window.location.host}/${process.env.PUBLIC_URL}`,
//                     // toolbarItems: [
//                     //     ...PSPDFKit.defaultToolbarItems,
//                     //     {
//                     //         type: "form-creator",
//                     //     },
//                     // ],
//                     // initialViewState: new PSPDFKit.ViewState({
//                     //     interactionMode: PSPDFKit.InteractionMode.FORM_CREATOR,
//                     // }),
//                 })

//                 // instance.setViewState(viewState => (
//                 //     viewState.set("formDesignMode", true)
//                 // ));

//                 // Retrieve all form fields.
//                 const formFields = await instance.getFormFields();

//                 // Set the `required` property for all form fields.
//                 const updatedFields = formFields.map(formField => formField.set('required', true));

//                 // Update the form fields.

//                 await instance.update(updatedFields);

//                 // get all fileds
//                 instance.getFormFields().then(function (formFields) {
//                     console.log("All form fields", formFields.toJS());
//                 });

//             } catch (error) {
//                 console.error("Error initializing PSPDFKit:", error);
//             }

//         };

//         initializePSPDFKit();

//         return () => {
//             if (instance) {
//                 instance.unload().catch(error => {
//                     console.error("Error unloading PSPDFKit:", error);
//                 });
//             }
//         };
//     }, [props.document]);

//     return <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />;
// }



// drag and drop from docs

// import PSPDFKit from "pspdfkit";
// import * as React from "react";

// // Assign the PSPDFKit instance to a module variable so we can access it
// // everywhere.
// let instance = null;

// // We track wether or not drag and drop is supported on the device. If not, we
// // allow clicking an item to place it as well (e.g on iPhones)
// let isDragAndDropSupported = false;
// export default function PdfViewerComponent(props) {
//     const containerRef = React.useRef(null);
//     // decide wether to turn on the sidebar or not.
//     const splitPaneElement = document.querySelector(".splitPane");
//     if (splitPaneElement) {
//         const viewWidth = splitPaneElement.getBoundingClientRect().width;

//         // We start by initializing an initial ViewState that hides all toolbars,
//         // opens the thumbnail sidebar, and places the sidebar on the other side.
//         var initialViewState = new PSPDFKit.ViewState({
//             showToolbar: false,
//             enableAnnotationToolbar: false,
//             sidebarMode: viewWidth > 1100 ? PSPDFKit.SidebarMode.THUMBNAILS : null,
//             sidebarPlacement: PSPDFKit.SidebarPlacement.END,
//         });

//         // Continue with the rest of your code that uses initialViewState
//     } else {
//         console.error(".splitPane element not found");
//     }

//     React.useEffect(() => {
//         const container = containerRef.current; // This `useRef` instance will render the PDF.

//         let PSPDFKit, instance;

//         (async function () {
//             PSPDFKit = await import("pspdfkit")

//             PSPDFKit.unload(container) // Ensure that there's only one PSPDFKit instance.

//             return await PSPDFKit.load({
//                 // Container where PSPDFKit should be mounted.
//                 container,
//                 // The document to open.
//                 document: props.document,
//                 // Use the public directory URL as a base URL. PSPDFKit will download its library assets from here.
//                 baseUrl: `${window.location.protocol}//${window.location.host}/${process.env.PUBLIC_URL}`,
//                 styleSheets: ["my_css.css"],
//                 annotationTooltipCallback,
//                 initialViewState
//             }).then((_instance) => {
//                 instance = _instance;

//                 // We only allow dropping elements onto a PDF page.
//                 instance.contentDocument.ondragover = function (event) {
//                     isDragAndDropSupported = true;

//                     const pageElement = closestByClass(event.target, "PSPDFKit-Page");

//                     if (pageElement) {
//                         // Allow drop operation
//                         event.preventDefault();
//                     }
//                 };

//                 instance.contentDocument.ondrop = function (event) {
//                     isDragAndDropSupported = true;

//                     const pageElement = closestByClass(event.target, "PSPDFKit-Page");

//                     if (pageElement) {
//                         const pageIndex = parseInt(pageElement.dataset.pageIndex);

//                         const isExternalDrop = event.dataTransfer.files.length > 0;

//                         if (isExternalDrop) {
//                             handleExternalDrop(event, pageIndex);
//                         } else {
//                             handleInternalDrop(event, pageIndex);
//                         }
//                     }
//                 };

//                 return instance;
//             });
//         })();

//         // return () => PSPDFKit && PSPDFKit.unload(container)
//     }, []);


//     // Event handler that is called when a file from outside is dropped onto the PDF
//     // page.
//     function handleExternalDrop(event, pageIndex) {
//         const file = event.dataTransfer.files[0];
//         const allowedExternalMimeTypes = ["image/jpeg", "image/png"];

//         if (!allowedExternalMimeTypes.includes(file.type)) {
//             return;
//         }

//         const clientX = event.clientX;
//         const clientY = event.clientY;

//         // We don't know the dimensions of the image. To do this, we first parse it
//         // with the use of this helper function. Note that it will run async so we
//         // continue in the callback function.
//         parseImageDimensions(file, (dimensions) => {
//             const ratio = dimensions.height / dimensions.width;

//             // External drag and drop items will have the cursor in the middle of the
//             // bounding box.
//             // We also scale the image so that the aspect ratio is kept.
//             const width = 220;
//             const height = width * ratio;

//             const clientRect = new PSPDFKit.Geometry.Rect({
//                 left: clientX - width / 2,
//                 top: clientY - height / 2,
//                 width,
//                 height,
//             });

//             const pageRect = instance.transformContentClientToPageSpace(
//                 clientRect,
//                 pageIndex
//             );

//             insertImageAnnotation(pageRect, file, pageIndex);
//         });

//         event.preventDefault();
//     }

//     // Event handler that is called when an annotation from the internal toolbar is
//     // dropped onto a PDF page.
//     function handleInternalDrop(event, pageIndex) {
//         // We know that internal drag and drop objects will have the cursor on the
//         // top left left side of the box. We also know the dimensions of the
//         // rectangles.
//         const clientRect = new PSPDFKit.Geometry.Rect({
//             left: event.clientX,
//             top: event.clientY,
//             width: 220,
//             height: 217,
//         });
//         // Ensure that 'instance' is available and not null
//         const pageRect = instance.transformContentClientToPageSpace(
//             clientRect,
//             pageIndex)
//         // const pageRect = instance.transformContentClientToPageSpace(
//         //     clientRect,
//         //     pageIndex
//         // );

//         // We generate text data with a string that either prefixes `pspdfkit/text` or
//         // `pspdfkit/image`.
//         const data = event.dataTransfer.getData("text");

//         if (data.startsWith("pspdfkit/text")) {
//             const text = data.replace("pspdfkit/text:", "");

//             insertTextAnnotation(
//                 pageRect,
//                 text,
//                 pageIndex,
//                 26 / instance.currentZoomLevel
//             );
//             event.preventDefault();
//         } else if (data.startsWith("pspdfkit/image")) {
//             const imageUrl = data.replace("pspdfkit/image:", "");

//             fetch(imageUrl)
//                 .then((r) => r.blob())
//                 .then((blob) => insertImageAnnotation(pageRect, blob, pageIndex));
//             event.preventDefault();
//         }
//     }

//     // Event handler for preparing image drag and drop
//     function setDragImageData(event) {
//         isDragAndDropSupported = true;
//         event.dataTransfer.setData("text", "pspdfkit/image:" + event.target.src);
//         event.dataTransfer.setDragImage &&
//             event.dataTransfer.setDragImage(event.target, 0, 0);
//         event.stopPropagation();
//     }

//     // Event handler for preparing text drag and drop
//     function setDragTextData(event) {
//         isDragAndDropSupported = true;
//         event.dataTransfer.setData("text", "pspdfkit/text:" + event.target.innerText);
//         event.dataTransfer.setDragImage &&
//             event.dataTransfer.setDragImage(event.target, 0, 0);
//         event.stopPropagation();
//     }

//     // Handles click events on draggable image items on non draggable devices
//     function handleImageClick(event) {
//         if (isDragAndDropSupported || !instance) {
//             return;
//         }

//         const target = event.target;

//         fetch(target.src)
//             .then((r) => r.blob())
//             .then((blob) => {
//                 const pageIndex = instance.viewState.currentPageIndex;
//                 const pageInfo = instance.pageInfoForIndex(pageIndex);

//                 insertImageAnnotation(
//                     new PSPDFKit.Geometry.Rect({
//                         width: target.width,
//                         height: target.height,
//                         left: pageInfo.width / 2 - target.width / 2,
//                         top: pageInfo.height / 2 - target.height / 2,
//                     }),
//                     blob,
//                     pageIndex
//                 );
//             });
//     }

//     // Handles click events on draggable text items on non draggable devices
//     function handleTextClick(event) {
//         if (isDragAndDropSupported || !instance) {
//             return;
//         }

//         const target = event.target;
//         const pageIndex = instance.viewState.currentPageIndex;
//         const pageInfo = instance.pageInfoForIndex(pageIndex);

//         insertTextAnnotation(
//             new PSPDFKit.Geometry.Rect({
//                 width: 220,
//                 height: 217,
//                 left: pageInfo.width / 2 - 220 / 2,
//                 top: pageInfo.height / 2 - 217 / 2,
//             }),
//             target.innerText,
//             pageIndex,
//             26
//         );
//     }

//     // Inserts a text annotation on the page.
//     // https://pspdfkit.com/guides/web/current/annotations/introduction-to-annotations/
//     async function insertTextAnnotation(pageRect, text, pageIndex, fontSize) {
//         const annotation = new PSPDFKit.Annotations.TextAnnotation({
//             boundingBox: pageRect,
//             text,
//             pageIndex,
//             fontSize,
//             horizontalAlign: "center",
//             verticalAlign: "center",
//             backgroundColor: PSPDFKit.Color.WHITE,
//         });

//         await instance
//             .create(annotation)
//             .then((annotations) => instance.setSelectedAnnotation(annotations[0]));
//     }

//     // Inserts an image annotation on the page.
//     // https://pspdfkit.com/guides/web/current/annotations/introduction-to-annotations/
//     async function insertImageAnnotation(pageRect, blob, pageIndex) {
//         instance.createAttachment(blob).then((attachmentId) => {
//             const annotation = new PSPDFKit.Annotations.ImageAnnotation({
//                 pageIndex,
//                 boundingBox: pageRect,
//                 contentType: "image/jpeg",
//                 imageAttachmentId: attachmentId,
//             });

//             instance
//                 .create(annotation)
//                 .then((annotations) => instance.setSelectedAnnotation(annotations[0]));
//         });
//     }

//     // The annotation tooltip can be used to place annotation tools directly on top
//     // of the annotation on screen.
//     //
//     // In this example, we use it as an alternative to the default annotation
//     // toolbars.
//     //
//     // https://web-examples.pspdfkit.com/tooltips
//     function annotationTooltipCallback(annotation) {
//         const deleteAnnotation = {
//             type: "custom",
//             title: "Delete",
//             onPress: async () => {
//                 if (window.confirm("Do you really want to delete the annotation?")) {
//                     await instance.delete(annotation.id);
//                 }
//             },
//         };

//         if (annotation instanceof PSPDFKit.Annotations.TextAnnotation) {
//             const increaseFontSize = {
//                 type: "custom",
//                 title: "Bigger",
//                 onPress: async () => {
//                     annotation = annotation.set("fontSize", annotation.fontSize * 1.2);
//                     annotation =
//                         instance.calculateFittingTextAnnotationBoundingBox(annotation);

//                     await instance.update(annotation);
//                 },
//             };

//             const decreaseFontSize = {
//                 type: "custom",
//                 title: "Smaller",
//                 onPress: async () => {
//                     annotation = annotation.set("fontSize", annotation.fontSize / 1.2);
//                     annotation =
//                         instance.calculateFittingTextAnnotationBoundingBox(annotation);

//                     await instance.update(annotation);
//                 },
//             };

//             return [increaseFontSize, decreaseFontSize, deleteAnnotation];
//         } else {
//             return [deleteAnnotation];
//         }
//     }

//     // Given a File object, we can create an <image/> tag to parse the image and
//     // retrieve the original dimensions.
//     function parseImageDimensions(file, onDimensions) {
//         const url = URL.createObjectURL(file);
//         const image = new Image();

//         image.onerror = () => URL.revokeObjectURL(url);
//         image.onload = () => {
//             onDimensions({ width: image.width, height: image.height });
//             URL.revokeObjectURL(url);
//         };
//         image.src = url;
//     }


//     const tools = [
//         { type: "image", filename: "https://source.unsplash.com/vuOxADFnnQ4/300x200" },
//         { type: "image", filename: "https://source.unsplash.com/vuOxADFnnQ4/300x200" },
//         { type: "image", filename: "https://source.unsplash.com/vuOxADFnnQ4/300x200" },
//         { type: "text", text: "Best Price" },
//         { type: "text", text: "Top Service" },
//     ];


//     // This div element will render the document to the DOM.
//     return (
//         <>
//             <div className="splitPane">
//                 <div className="splitPane-left">
//                     {tools.map((tool) => {
//                         if (tool.type === "image") {
//                             return (
//                                 <div key={tool.filename} className="image-tool tool">
//                                     <img
//                                         src={"/drag-and-drop/static/" + tool.filename}
//                                         width="220"
//                                         height="217"
//                                         onDragStart={setDragImageData}
//                                         onClick={handleImageClick}
//                                         draggable
//                                     />
//                                 </div>
//                             );
//                         } else {
//                             return (
//                                 <div
//                                     key={tool.text}
//                                     className="text-tool tool"
//                                     onDragStart={setDragTextData}
//                                     onClick={handleTextClick}
//                                     draggable
//                                 >
//                                     {tool.text}
//                                 </div>
//                             );
//                         }
//                     })}
//                 </div>

//                 <div ref={containerRef} className="splitPane-right" style={{ width: "100%", height: "100vh" }} />
//                 <style jsx>{`
//       .splitPane {
//         width: 100%;
//         height: 100%;
//         background: #f6f8fa;
//         display: flex;
//       }

//       .splitPane-left {
//         background-color: rgb(250, 251, 251);
//         padding: 10px;
//       }

//       .splitPane-right {
//         height: 100%;
//         flex-grow: 1;
//       }

//       .tool {
//         margin: 10px;
//       }

//       .image-tool {
//         display: block;
//         cursor: pointer;
//       }

//       .image-tool img {
//         outline: 2px solid #eee;
//         outline-offset: -2px;
//       }

//       .text-tool {
//         width: 220px;
//         height: 217px;
//         cursor: pointer;
//         font-size: 26px;
//         text-align: center;
//         line-height: 217px;
//         font-weight: bold;
//         border: 2px solid #eee;
//         color: #444;
//         background: white;
//       }

//       @media only screen and (min-width: 768px) {
//         .splitPane-left {
//           width: 300px;
//           height: 100vh;
//           overflow-y: auto;
//           -webkit-overflow-scrolling: touch;
//           padding: 0 20px;
//           box-shadow: 5px 0 5px rgba(200, 200, 200, 0.2);
//         }

//         .splitPane {
//           flex-direction: row;
//         }

//         .tool {
//           display: block;
//         }
//       }

//       @media only screen and (max-width: 767px) {
//         .splitPane-left {
//           width: auto;
//           overflow-y: hidden;
//           overflow-x: auto;
//           -webkit-overflow-scrolling: touch;
//           padding: 0px;
//           box-shadow: 5px 0 5px rgba(200, 200, 200, 0.2);
//           white-space: nowrap;
//         }

//         .splitPane-right {
//           height: calc(100% - 150px);
//         }

//         .splitPane {
//           flex-direction: column;
//         }

//         .tool,
//         .tool > img {
//           width: 110px;
//           height: 108px;
//           display: inline-block;
//         }

//         .text-tool {
//           font-size: 13px;
//           line-height: 108px;
//         }

//         .tool {
//           vertical-align: top;
//         }
//       }
//     `}</style>
//             </div>
//         </>)
// }
// function closestByClass(el, className) {
//     return el && el.classList && el.classList.contains(className)
//         ? el
//         : el
//             ? closestByClass(el.parentNode, className)
//             : null;
// }









// import React, { useEffect, useRef } from "react";
// import PSPDFKit from "pspdfkit";

// export default function PdfViewerComponent(props) {
//     const containerRef = useRef(null);

//     useEffect(() => {
//         const container = containerRef.current;

//         let instance;

//         const initializePSPDFKit = async () => {
//             PSPDFKit.load({
//                 container,
//                 document: props.document,
//                 baseUrl: `${window.location.protocol}//${window.location.host}/${process.env.PUBLIC_URL}`,
//                 styleSheets: ["my_css.css"],
//                 annotationTooltipCallback: (annotation) => {
//                     if (annotation instanceof PSPDFKit.Annotations.ShapeAnnotation) {
//                         const label = instance.contentDocument.createElement("label");
//                         label.setAttribute("htmlFor", "stroke");
//                         label.classList.add("stroke-color-label");
//                         label.innerHTML = "<span>Stroke Color</span>";

//                         const input = instance.contentDocument.createElement("input");
//                         input.setAttribute("type", "color");
//                         input.setAttribute("id", "stroke");
//                         input.value = annotation.strokeColor.toHex();
//                         input.addEventListener("change", (e) => {
//                             const newAnn = annotation.set(
//                                 "strokeColor",
//                                 new PSPDFKit.Color(hexToRgb(e.target.value))
//                             );
//                             instance.update(newAnn);
//                         });
//                         label.appendChild(input);

//                         const toolItem = {
//                             type: "custom",
//                             node: label,
//                             onPress: function () {
//                                 console.log(annotation);
//                             },
//                         };

//                         return [toolItem];
//                     } else {
//                         return [];
//                     }
//                 },
//                 initialViewState: new PSPDFKit.ViewState({
//                     enableAnnotationToolbar: false,
//                     sidebarMode: PSPDFKit.SidebarMode.THUMBNAILS,
//                     sidebarPlacement: PSPDFKit.SidebarPlacement.END,
//                 }),
//             }).then((_instance) => {
//                 instance = _instance;
//             });
//         };

//         initializePSPDFKit();

//         return () => PSPDFKit && PSPDFKit.unload(container);
//     }, [props.document]);

//     function hexToRgb(hex) {
//         const numberPart = hex.split("#")[1];
//         const number = parseInt(numberPart, 16);

//         return {
//             r: (number >> 16) & 255,
//             g: (number >> 8) & 255,
//             b: number & 255,
//         };
//     }

//     return <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />;
// }


// // Define the duplicateAnnotationTooltipCallback function here
// const duplicateAnnotationTooltipCallback = annotation => {
//     if (annotation instanceof PSPDFKit.Annotations.TextAnnotation) {
//         const duplicateItem = {
//             type: "custom",
//             title: "Duplicate",
//             id: "tooltip-duplicate-annotation",
//             className: "TooltipItem-Duplication",
//             onPress: () => {
//                 const newBoundingBox = annotation.boundingBox
//                     .set("top", annotation.boundingBox.top + 50)
//                     .set("left", annotation.boundingBox.left + 50);
//                 const duplicatedAnnotation = annotation
//                     .set("id", null)
//                     .set("boundingBox", newBoundingBox);
//                 instance.create(duplicatedAnnotation); // Use instance.create
//             },
//         };
//         return [duplicateItem];
//     } else {
//         return [];
//     }
// };


// toolbarItems: [
//     ...PSPDFKit.defaultToolbarItems,
//     {
//         type: "custom",
//         title: "Arrow",
//         onPress() {
//             instance.setCurrentAnnotationPreset("line");
//             instance.setViewState(viewState =>
//                 viewState.set("interactionMode", PSPDFKit.InteractionMode.SHAPE_LINE)
//             );
//         }
//     }
// ],


// Annation set

// import React, { useEffect, useRef } from "react";
// import PSPDFKit from "pspdfkit";

// export default function PdfViewerComponent(props) {
//     const containerRef = useRef(null);

//     useEffect(() => {
//         const container = containerRef.current;
//         let instance;

//         const initializePSPDFKit = async () => {
//             PSPDFKit.load({
//                 container,
//                 document: props.document,
//                 baseUrl: `${window.location.protocol}//${window.location.host}/${process.env.PUBLIC_URL}`,
//                 annotationTooltipCallback: (annotation) => {
//                     if (annotation instanceof PSPDFKit.Annotations.ShapeAnnotation) {
//                         const label = instance.contentDocument.createElement("label");
//                         label.setAttribute("htmlFor", "stroke");
//                         label.classList.add("stroke-color-label");
//                         label.innerHTML = "<span>Stroke Color</span>";

//                         const input = instance.contentDocument.createElement("input");
//                         input.setAttribute("type", "color");
//                         input.setAttribute("id", "stroke");
//                         input.value = annotation.strokeColor.toHex();
//                         input.addEventListener("change", (e) => {
//                             const newAnn = annotation.set(
//                                 "strokeColor",
//                                 new PSPDFKit.Color(hexToRgb(e.target.value))
//                             );
//                             instance.update(newAnn);
//                         });
//                         label.appendChild(input);

//                         const toolItem = {
//                             type: "custom",
//                             node: label,
//                             onPress: async () => {
//                                 if (window.confirm("Do you really want to delete the annotation?")) {
//                                     await instance.delete(annotation.id);
//                                 }
//                             },
//                         };

//                         return [toolItem];
//                     } else {
//                         return [];
//                     }
//                 },
//                 annotationPresetsUpdate: (updateEvent) => {
//                     // Handle annotation presets update here...
//                     console.log("Annotation presets updated:", updateEvent);
//                 },
//                 initialViewState: new PSPDFKit.ViewState({
//                     enableAnnotationToolbar: true,
//                 }),
//             }).then((_instance) => {
//                 instance = _instance;

//                 instance.setAnnotationPresets((presets) => {
//                     presets.thick = {
//                         ...presets.arrow,
//                         strokeWidth: 15
//                     };
//                     return presets;
//                 });

//                 instance.setToolbarItems((items) => {
//                     return items.map((i) => {
//                         if (i.type === "arrow") {
//                             return {
//                                 ...i,
//                                 preset: "thick",
//                                 title: "My custom arrow"
//                             };
//                         }
//                         return i;
//                     });
//                 });
//             });
//         };

//         initializePSPDFKit();

//         return () => PSPDFKit && PSPDFKit.unload(container);
//     }, [props.document]);

//     function hexToRgb(hex) {
//         const numberPart = hex.split("#")[1];
//         const number = parseInt(numberPart, 16);

//         return {
//             r: (number >> 16) & 255,
//             g: (number >> 8) & 255,
//             b: number & 255,
//         };
//     }

//     return <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />;
// }
