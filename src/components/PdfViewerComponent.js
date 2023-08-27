import React, { useEffect, useRef } from "react";
import PSPDFKit from "pspdfkit";

export default function PdfViewerComponent(props) {
    const containerRef = useRef(null);
    let instance = null;

    useEffect(() => {
        const container = containerRef.current;

        const initializePSPDFKit = async () => {
            try {

                instance = await PSPDFKit.load({
                    container,
                    document: props.document,
                    styleSheets: ['my_css.css'],
                    baseUrl: `${window.location.protocol}//${window.location.host}/${process.env.PUBLIC_URL}`,
                    // toolbarItems: [
                    //     ...PSPDFKit.defaultToolbarItems,
                    //     {
                    //         type: "form-creator",
                    //     },
                    // ],
                    // initialViewState: new PSPDFKit.ViewState({
                    //     interactionMode: PSPDFKit.InteractionMode.FORM_CREATOR,
                    // }),
                })

                // instance.setViewState(viewState => (
                //     viewState.set("formDesignMode", true)
                // ));

                // Retrieve all form fields.
                const formFields = await instance.getFormFields();

                // Set the `required` property for all form fields.
                const updatedFields = formFields.map(formField => formField.set('required', true));

                // Update the form fields.

                await instance.update(updatedFields);

                // get all fileds
                instance.getFormFields().then(function (formFields) {
                    console.log("All form fields", formFields.toJS());
                });

            } catch (error) {
                console.error("Error initializing PSPDFKit:", error);
            }

        };

        initializePSPDFKit();

        return () => {
            if (instance) {
                instance.unload().catch(error => {
                    console.error("Error unloading PSPDFKit:", error);
                });
            }
        };
    }, [props.document]);

    return <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />;
}



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
