import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react";
import { trackEvent } from "../analytics/ga";

export default function Unauthorized() {
  const navigate = useNavigate();

  useEffect(() => {
    trackEvent("Security", {
      context: "Unauthorized Access",
      location: window.location,
    });
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <Card className="w-full max-w-md p-8 text-center border border-gray-700 bg-gray-800 shadow-lg">
        <h1 className="text-5xl font-bold text-yellow-500">403</h1>
        <p className="text-lg text-gray-300 mt-2">Access Denied</p>
        <p className="text-sm text-gray-400 mt-1">
          You don&apos;t have permission to view this page.
        </p>
        <CardContent className="mt-4 space-y-3">
          <Button
            className="w-full bg-indigo-500 hover:bg-indigo-600"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
          <Button asChild className="w-full bg-gray-700 hover:bg-gray-600">
            <Link to="/">Go Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
