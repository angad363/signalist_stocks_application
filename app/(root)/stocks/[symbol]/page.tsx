import TradingViewWidget from "@/components/TradingViewWidget";
import {
  BASELINE_WIDGET_CONFIG,
  CANDLE_CHART_WIDGET_CONFIG,
  COMPANY_FINANCIALS_WIDGET_CONFIG,
  COMPANY_PROFILE_WIDGET_CONFIG,
  SYMBOL_INFO_WIDGET_CONFIG,
  TECHNICAL_ANALYSIS_WIDGET_CONFIG,
} from "@/lib/contants";
import WatchlistButton from "@/components/WatchlistButton";

// Stock details page
// Requirements:
// - Responsive 2-column grid layout with left and right sections
// - Left: SYMBOL_INFO, CANDLE_CHART, BASELINE
// - Right: WatchlistButton (first), TECHNICAL_ANALYSIS, COMPANY_PROFILE, COMPANY_FINANCIALS

const StockDetails = async ({ params }: StockDetailsPageProps) => {
  const { symbol } = await params;

  const scriptBase =
    "https://s3.tradingview.com/external-embedding/embed-widget-";

  return (
    <div className="flex min-h-screen w-full">
      <section className="grid w-full gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Left column */}
        <div className="space-y-6">
          <TradingViewWidget
            scriptUrl={`${scriptBase}symbol-info.js`}
            config={SYMBOL_INFO_WIDGET_CONFIG(symbol)}
            height={170}
          />
          <TradingViewWidget
            scriptUrl={`${scriptBase}advanced-chart.js`}
            config={CANDLE_CHART_WIDGET_CONFIG(symbol)}
            className="custom-chart"
            height={600}
          />
          <TradingViewWidget
            scriptUrl={`${scriptBase}advanced-chart.js`}
            config={BASELINE_WIDGET_CONFIG(symbol)}
            className="custom-chart"
            height={600}
          />
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Watchlist button placed before technical analysis as requested */}
          <WatchlistButton symbol={symbol} company={symbol} isInWatchlist={false} />

          <TradingViewWidget
            scriptUrl={`${scriptBase}technical-analysis.js`}
            config={TECHNICAL_ANALYSIS_WIDGET_CONFIG(symbol)}
            height={400}
          />

          <TradingViewWidget
            scriptUrl={`${scriptBase}symbol-profile.js`}
            config={COMPANY_PROFILE_WIDGET_CONFIG(symbol)}
            height={440}
          />

          <TradingViewWidget
            scriptUrl={`${scriptBase}fundamental-data.js`}
            config={COMPANY_FINANCIALS_WIDGET_CONFIG(symbol)}
            height={464}
          />
        </div>
      </section>
    </div>
  );
};

export default StockDetails;