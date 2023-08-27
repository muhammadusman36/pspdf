import './App.css';

import document from "./assets/complete.pdf"
import PdfViewerComponent from "./components/PdfViewerComponent"
function App() {
  return (
    <>
      <body>
        <div className="App">
          <div className="PDF-viewer">
            <PdfViewerComponent
              document={document}
            />
          </div>
        </div>
      </body>
    </>
  );
}

export default App;
