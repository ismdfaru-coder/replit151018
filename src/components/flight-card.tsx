
import Image from 'next/image';
import { ArrowRight, Plane, Info, Heart } from 'lucide-react';
import { type Flight, type FlightLeg } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

interface FlightCardProps {
    flight: Flight;
    layout?: 'list' | 'grid';
    searchParams?: {
        origin?: string;
        destination?: string;
        departureDate?: string;
        returnDate?: string | null;
        passengers?: number;
    };
}

const FlightLegRow = ({ leg }: { leg: FlightLeg }) => (
    <div className="flex items-center gap-4">
         <Image
            src={leg.airlineLogoUrl}
            alt={`${leg.airline} logo`}
            width={24}
            height={24}
            className="rounded-full"
            data-ai-hint="airline logo"
        />
        <div className="flex items-center gap-4 text-sm w-full">
            <div>
                <p className="font-semibold text-lg">{leg.departureTime}</p>
                <p>{leg.fromCode || 'GLA'}</p>
            </div>
            <div className="flex-grow flex flex-col items-center text-muted-foreground relative mx-2">
                <span className="text-xs mb-1">{leg.duration}</span>
                <div className="border-b border-dashed w-full relative">
                    <div className="absolute -top-[5px] left-0 h-2 w-2 rounded-full border bg-background" />
                    <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4" />
                     <div className="absolute -top-[5px] right-0 h-2 w-2 rounded-full border bg-background" />
                </div>
                 <span className="text-primary text-xs font-semibold mt-1">{leg.stops}</span>
            </div>
            <div>
                <p className="font-semibold text-lg">{leg.arrivalTime}</p>
                <p>{leg.toCode || 'MAA'}</p>
            </div>
        </div>
    </div>
);


export default function FlightCard({ flight, layout = 'list', searchParams }: FlightCardProps) {
  // Generate Google Flights URL using the original user search parameters
  const generateGoogleFlightsUrl = () => {
    // PRIORITY: Use search parameters from original user query
    const origin = searchParams?.origin || flight.from?.airport || flight.from?.code || flight.legs[0]?.fromCode || 'London';
    const destination = searchParams?.destination || flight.to?.airport || flight.to?.code || flight.legs[0]?.toCode || 'Dubai';
    const passengers = searchParams?.passengers || 1;
    
    // Use the exact search dates the user specified
    const departureDateStr = searchParams?.departureDate || (() => {
      const date = new Date();
      date.setDate(date.getDate() + 7);
      return date.toISOString().split('T')[0];
    })();
    
    // Handle return date - MUST preserve user's original search intent (one-way vs round-trip)
    const returnDateStr = searchParams?.returnDate;
    
    // Build Google Flights URL matching user's exact search type
    let query: string;
    if (returnDateStr && returnDateStr.trim() !== '') {
      // Round trip: User specified a return date
      query = `Flights+to+${encodeURIComponent(destination)}+from+${encodeURIComponent(origin)}+for+${passengers}+adults+on+${departureDateStr}+through+${returnDateStr}`;
    } else {
      // One-way: User did NOT specify return date - do not add "through" segment
      query = `Flights+to+${encodeURIComponent(destination)}+from+${encodeURIComponent(origin)}+for+${passengers}+adults+on+${departureDateStr}`;
    }
    
    return `https://www.google.com/travel/flights?q=${query}&curr=GBP&gl=uk&hl=en`;
  };
  
  const handleSelectFlight = () => {
    const googleFlightsUrl = generateGoogleFlightsUrl();
    window.open(googleFlightsUrl, '_blank');
  };
  
  // Get primary leg details
  const primaryLeg = flight.legs[0];
  const isEmiratesStyle = flight.airline === 'Emirates' || flight.legs[0]?.airline === 'Emirates';
  if (layout === 'grid') {
    return (
        <Card className="hover:shadow-lg transition-shadow duration-300 relative group">
            <CardContent className="p-4 flex flex-col md:flex-row items-center gap-4">
                <div className="flex-1 w-full space-y-4">
                    {flight.legs.map((leg, index) => (
                         <FlightLegRow key={index} leg={leg} />
                    ))}
                </div>
                <Separator orientation="vertical" className="h-24 hidden md:block" />
                <div className="w-full md:w-48 flex flex-row md:flex-col items-center justify-between md:text-right gap-2 pt-4 md:pt-0 border-t md:border-t-0 md:border-l pl-4">
                    <div className="text-left md:text-right">
                        <p className="text-xs text-muted-foreground">Book with {flight.provider} from</p>
                        <p className="text-2xl font-bold">£{flight.price}</p>
                        <p className="text-xs text-muted-foreground">£{flight.price * 2} total</p>
                    </div>
                    <Button onClick={handleSelectFlight}>
                        Select <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
                <Button variant="ghost" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Heart className="h-5 w-5 text-muted-foreground" />
                </Button>
            </CardContent>
            {flight.emissions && (
                <div className="border-t p-2 text-center text-xs text-muted-foreground bg-green-50">
                    This flight emits {flight.emissions.co2}% less CO2e than a typical flight on this route <Info className="inline h-3 w-3" />
                </div>
            )}
        </Card>
    );
  }
  
  // Emirates-style layout (matching user's reference image)
  return (
    <Card className={cn(
      "hover:shadow-lg transition-shadow duration-300 overflow-hidden",
      isEmiratesStyle ? "border-red-200" : ""
    )}>
      <CardContent className="p-0">
        {/* Header with airline branding */}
        <div className={cn(
          "px-4 py-3 flex items-center justify-between",
          isEmiratesStyle ? "bg-red-600 text-white" : "bg-blue-600 text-white"
        )}>
          <div className="flex items-center gap-3">
            <Image
              src={primaryLeg.airlineLogoUrl}
              alt={`${primaryLeg.airline} logo`}
              data-ai-hint="airline logo"
              width={32}
              height={32}
              className="rounded-full bg-white p-1"
            />
            <div>
              <p className="font-bold text-white">{primaryLeg.airline}</p>
              <p className="text-xs opacity-90">Economy</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs opacity-90">from</p>
            <p className="text-2xl font-bold">£{flight.price}</p>
          </div>
        </div>

        {/* Flight details section */}
        <div className="px-4 py-4 bg-white">
          <div className="flex items-center justify-between">
            {/* Departure */}
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {flight.from?.time || primaryLeg.departureTime}
              </p>
              <p className="text-sm text-gray-600 font-medium">
                {flight.from?.code || primaryLeg.fromCode}
              </p>
              <p className="text-xs text-gray-500">
                {flight.from?.airport || 'Departure'}
              </p>
            </div>

            {/* Flight path */}
            <div className="flex-1 flex flex-col items-center mx-6">
              <div className="flex items-center w-full">
                <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                <div className="flex-1 h-0.5 bg-gray-300 relative">
                  <Plane className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                </div>
                <div className="w-2 h-2 rounded-full bg-gray-400"></div>
              </div>
              <div className="mt-2 text-center">
                <p className="text-sm font-semibold text-gray-900">
                  {flight.duration || primaryLeg.duration}
                </p>
                <p className={cn(
                  "text-xs px-2 py-1 rounded-full font-medium",
                  (flight.stops ?? 0) === 0 ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                )}>
                  {(flight.stops ?? 0) === 0 ? 'Direct' : flight.stopDetails || `${flight.stops ?? 1} stop${(flight.stops ?? 1) > 1 ? 's' : ''}`}
                </p>
              </div>
            </div>

            {/* Arrival */}
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {flight.to?.time || primaryLeg.arrivalTime}
              </p>
              <p className="text-sm text-gray-600 font-medium">
                {flight.to?.code || primaryLeg.toCode}
              </p>
              <p className="text-xs text-gray-500">
                {flight.to?.airport || 'Arrival'}
              </p>
            </div>
          </div>
        </div>

        {/* Action footer */}
        <div className={cn(
          "px-4 py-3 flex items-center justify-between border-t",
          isEmiratesStyle ? "bg-red-50 border-red-100" : "bg-blue-50 border-blue-100"
        )}>
          <div className="text-sm text-gray-600">
            <span>Book with {flight.provider || primaryLeg.airline}</span>
          </div>
          <Button 
            onClick={handleSelectFlight}
            className={cn(
              "font-semibold",
              isEmiratesStyle ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
            )}
          >
            Select
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
      
      {/* Emissions info (if available) */}
      {flight.emissions && (
        <div className="px-4 py-2 bg-green-50 border-t text-center text-xs text-green-700">
          <Info className="inline h-3 w-3 mr-1" />
          This flight emits {flight.emissions.co2}% less CO2e than typical
        </div>
      )}
    </Card>
  );
}
