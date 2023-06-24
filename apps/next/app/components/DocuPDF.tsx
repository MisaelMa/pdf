"use client";

import { Document, Page, pdfjs } from "react-pdf";
import { PDFViewer, pdf } from "@react-pdf/renderer/src";
import React, { useEffect, useState } from "react";

import Quixote from "./PDFSSR";
import dynamic from "next/dynamic";
import styled from "@emotion/styled";
import { useAsync } from "react-use";

const PdfPage = dynamic(() => import("./pdfPage"), {
  ssr: false,
});

const WrapperNavigator = styled.div`
  display: flex;
  height: 64px;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.black};
`;

const PageIndicator = styled.span`
  margin: 0px 12px;
`;

const PageNavigator = ({
  currentPage,
  numPages,
  onPreviousPage,
  onNextPage,
}: any) => {
  if (numPages <= 1) return null;

  return (
    <WrapperNavigator>
      <button disabled={currentPage !== 1} onClick={onPreviousPage} />

      <PageIndicator>{`Page ${currentPage} / ${numPages}`}</PageIndicator>

      <button disabled={currentPage < numPages} onClick={onNextPage} />
    </WrapperNavigator>
  );
};

const Wrapper = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  position: relative;
  flex-direction: column;
`;

const DocumentWrapper = styled.div`
  flex: 1;
  padding: 1em;
  display: flex;
  z-index: 500;
  align-items: center;
  justify-content: center;

  .react-pdf__Document {
    &.previous-document {
      canvas {
        opacity: 0.5;
      }
    }

    &.rendering-document {
      position: absolute;

      .react-pdf__Page {
        box-shadow: none;
      }
    }
  }
`;

const Message = styled.div`
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  z-index: 1000;
  position: absolute;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  transition: all 1s;
  opacity: ${(props) => (props.active ? 1 : 0)};
  pointer-events: ${(props) => (props.active ? "all" : "none")};
`;

const PDFViewerWithNoSSR = ({ value }: any) => {
  const [numPages, setNumPages] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  const [previousRenderValue, setPreviousRenderValue] = useState(null);

  const render = useAsync(async () => {
    if (!value) return null;

    const blob = await pdf(value).toBlob();
    const url = URL.createObjectURL(blob);
    console.log("blob", blob);

    return url;
  }, [value]);
  const onPreviousPage = () => {
    setCurrentPage((prev) => prev - 1);
  };

  const onNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const onDocumentLoad = (d) => {
    setNumPages(d.numPages);
    setCurrentPage((prev) => Math.min(prev, d.numPages));
  };

  const isFirstRendering = !previousRenderValue;

  const isLatestValueRendered = previousRenderValue === render.value;
  const isBusy = render.loading || !isLatestValueRendered;

  const shouldShowTextLoader = isFirstRendering && isBusy;
  const shouldShowPreviousDocument = !isFirstRendering && isBusy;

  return (
    <Wrapper>
      {/* <PDFViewer>
        <Quixote />
      </PDFViewer> */}
      <DocumentWrapper>
        <PdfPage pdf={render.value}></PdfPage>
      </DocumentWrapper>
      <PageNavigator
        currentPage={currentPage}
        numPages={numPages}
        onNextPage={onNextPage}
        onPreviousPage={onPreviousPage}
      />
    </Wrapper>
  );
};

export default PDFViewerWithNoSSR;
