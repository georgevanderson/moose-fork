import SnippetCard from "./snippet-card";
import { CliData, Route } from "app/db";
import CodeCard from "./code-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { cn } from "lib/utils";
import { segmentedTabListStyle, segmentedTabTriggerStyle } from "./style-utils";

interface IngestionInstructionProps {
  cliData: CliData;
  jsSnippet: string;
  pythonSnippet: string;
  bashSnippet: string;
  ingestionPoint: Route;
}
export default function IngestionInstructions({
  cliData,
  jsSnippet,
  pythonSnippet,
  ingestionPoint,
  bashSnippet,
}: IngestionInstructionProps) {
  if (!cliData.project) {
    return <div>Project not found</div>;
  }

  return (
    <Tabs defaultValue="ingestion-point">
      <TabsList className={cn(segmentedTabListStyle, "flex-grow-0")}>
        <TabsTrigger
          className={cn(segmentedTabTriggerStyle)}
          value="ingestion-point"
        >
          Ingestion Point
        </TabsTrigger>
        <TabsTrigger className={cn(segmentedTabTriggerStyle)} value="sdk">
          SDK
        </TabsTrigger>
      </TabsList>
      <TabsContent value="ingestion-point">
        <div className="pb-4">
          <h1 className="text-lg">
            Send data over http to the ingestion point
          </h1>
          <SnippetCard
            title="Ingestion point"
            code={
              cliData.project &&
              `http://${cliData.project.http_server_config.host}:${cliData.project.http_server_config.port}/${ingestionPoint.route_path}`
            }
            comment={`// from the sdk package directory ${cliData.project && cliData.project.project_file_location}/.moose/${cliData.project.name}-sdk`}
          />
          <div className="py-4">
            <div className="py-4">
              <CodeCard
                title="Code"
                snippets={[
                  {
                    language: "javascript",
                    code: jsSnippet,
                  },
                  {
                    language: "python",
                    code: pythonSnippet,
                  },
                  {
                    language: "bash",
                    code: bashSnippet,
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="sdk">
        <div className="py-4">
          <h1 className="text-lg">Use an autogenerated SDK</h1>
          <SnippetCard
            title="Step 1: Link autogenerated SDKs to make them globally available"
            code={"npm link -g"}
          />
          <div className="py-4">
            <SnippetCard
              title={
                "Step 2: Link autogenerated sdk to your project from global packages"
              }
              comment={`// your application's directory where your package.json is`}
              code={`npm install ${cliData.project && cliData.project.name}-sdk`}
            />
          </div>
          <div className="py-4">
            <SnippetCard
              title={"Step 3: Import SDK int your code and get started"}
              comment={`// your application's directory where your package.json is`}
              code={`import ${cliData.project && cliData.project.name}-sdk`}
            />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
