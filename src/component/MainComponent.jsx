import {useSearchParams} from "react-router-dom";
import BenchmarkDivsStagger from "./benchmarks/BenchmarkDivsStagger";
import BenchmarkPixi from "./benchmarks/BenchmarkPixi";
import BenchmarkSvgs from "./benchmarks/BenchmarkSvgs";
import BenchmarkCanvas from "./benchmarks/BenchmarkCanvas";
import React from "react";

const TABS = {
  DIVS: BenchmarkDivsStagger,
  PIXI: BenchmarkPixi,
  SVGS: BenchmarkSvgs,
  CANVAS: BenchmarkCanvas
}

const MainComponent = () => {
  const [searchParams] = useSearchParams();
  const currentTab = searchParams.get('tab');
  const animationLibrary = searchParams.get('library');
  const particles = searchParams.get('particles');

  const CurrentComponent = currentTab && TABS[currentTab];

  const componentProps = {
    animationLibrary,
    particles
  }

  return (
    <div>
      {CurrentComponent && <CurrentComponent {...componentProps} />}
      <div id='content'></div>
    </div>
  );
}

export default MainComponent
