import Link from "next/link";

import { CTABar, CTAButton, PlaceholderImage } from "../../page";
import FooterSection from "../../sections/FooterSection";
import { EmailSection } from "../../sections/EmailSection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Separator,
} from "design-system/components";
import {
  Grid,
  Section,
  FullWidthContentContainer,
} from "design-system/components/containers";
import { CodeSnippet, Display, Text } from "design-system/typography";

interface TemplateAccordionItem {
  title: string;
  steps: {
    title: string;
    description: string;
    command?: string;
    action?: {
      label: string;
      href: string;
    };
  }[];
}

interface TemplateAccordionProps {
  templateAccordionItems: TemplateAccordionItem[];
}

function TemplateAccordion({ templateAccordionItems }: TemplateAccordionProps) {
  return (
    <Accordion
      type="single"
      defaultValue="item-0"
      collapsible
      className="w-full"
    >
      {templateAccordionItems.map((item, index) => (
        <AccordionItem value={`item-${index}`} key={index}>
          <AccordionTrigger>
            <Text>{item.title}</Text>
          </AccordionTrigger>
          <AccordionContent>
            {item.steps.map((step, index) => (
              <div key={index} className="py-5">
                <Text className="text-muted-foreground">{step.title}</Text>
                <Text>{step.description}</Text>
                {step.command && (
                  <CodeSnippet className="my-5">{step.command}</CodeSnippet>
                )}
                {step.action && (
                  <Link href={step.action.href}>
                    <CTAButton>{step.action.label}</CTAButton>
                  </Link>
                )}
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

// The layout for specific tempaltes
export default function TemplatePage({
  params,
}: {
  params: { templateId: string };
}) {
  const content = {
    templateDetails: [
      {
        slug: "product-analytics",
        title: "Product Analytics",
        cta: {
          action: "cta-product-analytics-install",
          label: "Copy npx command",
          text: "npx create-moose-app --template product-analytics",
        },
        description:
          "Harness the power of a full-stack, real-time user analytics platform designed for product analytics, powered by MooseJS and NextJS.",
        features: {
          title: "Features",
          items: [
            {
              title: "Analytics services",
              label: "Backend",
              items: ["MooseJS", "Event Data Models", "Bot Filtering Flow"],
            },
            {
              title: "Analytics dashboard",
              label: "Frontend",
              items: ["NextJS", "TailwindCSS", "Observable Plot"],
            },
            {
              title: "Analytics utilities",
              label: "Intrumentation",
              items: [
                "Event Capture SDK",
                "Page tacking",
                "Session managemment",
              ],
            },
          ],
        },
        usage: [
          {
            title: "Setting up locally",
            steps: [
              {
                title: "Step 1",
                description:
                  "Begin with installing the template on your machine",
                command: "npx create-moose-app --template product-analytics",
              },
              {
                title: "Step 2",
                description:
                  "Install the dependencies and start the development server in your new project directory",
                command: "npm install && npm run dev",
              },
              {
                title: "Step 3",
                description:
                  "Navigate to localhost:3001 to view the provided data models, flows, and insights.",
              },
              {
                title: "Step 4",
                description:
                  "Navigate to localhost:3000 to view your NextJS application.",
              },
            ],
          },
          {
            title: "Capturing Events",
            description:
              "You'll now need to capture events in your user facing applications. You can find endpoints and SDKs in your moose console running on localhost:3001.",
            steps: [
              {
                title: "Step 1",
                description:
                  "From your moose application directory link the autogenerated sdks to your global node_modules directory",
                command: "npm link ./moose/<moose-project-name>-sdk",
              },
              {
                title: "Step 2",
                description:
                  "Import the captureEvent function from the sdk in your application",
                command:
                  "import { captureEvent } from '<moose-project-name>-sdk';",
              },
              {
                title: "Step 3",
                description:
                  "Track events in your application using the captureEvent function",
                command: "captureEvent('event-name', { data: 'data' });",
              },
              {
                title: "Step 4",
                description:
                  "Navigate to localhost:3001 to view the events being captured in real-time.",
              },
              {
                title: "Additional Resources",
                description:
                  "We provide additional snippets to instrument applications in other languages in your console.",
                action: {
                  label: "Go to localhost:3001",
                  href: "/additional-resources",
                },
              },
            ],
          },
          {
            title: "Deployment",
            steps: [
              {
                title: "Step 1",
                description:
                  "Begin with: npx create-moose-app --template product-analytics.",
              },
              {
                title: "Step 2",
                description:
                  "Initiate and inspect your Moose development environment: Execute `npm run dev`, then access localhost:3001 to review the provided data models, flows, and insights.",
              },
            ],
          },
          {
            title: "Additional Resources",
            steps: [
              {
                title: "Step 1",
                description:
                  "Begin with: npx create-moose-app --template product-analytics.",
              },
              {
                title: "Step 2",
                description:
                  "Initiate and inspect your Moose development environment: Execute `npm run dev`, then access localhost:3001 to review the provided data models, flows, and insights.",
              },
            ],
          },
        ],
      },
      {
        slug: "llm-application",
        title: "Loose Moose",
        description: "Let the moose loose",
        usage: [],
      },
      {
        slug: "data-warehouse",
        title: "Loose Moose",
        description: "Let the moose loose",
        usage: [],
      },
    ],
  };

  const template = content.templateDetails.find(
    (template) => template.slug === params.templateId
  );

  return (
    <Grid className="h-full w-full relative">
      <div className="col-span-12 md:col-span-6 h-full  pb-5">
        <div className="md:sticky top-20">
          <Section
          // className="2xl:mt-0"
          >
            <div>
              <Link href="/templates">
                <Text className="mt-0 pt-5">
                  <span className="text-muted-foreground">Templates / </span>{" "}
                  <span> {template?.title} </span>
                </Text>
              </Link>
            </div>
            <Display>{template?.title}</Display>
            <Text>{template?.description}</Text>
            <CTABar>
              <CTAButton>{template?.cta?.label}</CTAButton>
            </CTABar>
            <div className="py-10">
              {template?.features?.items.map((feature, index) => (
                <Grid key={index}>
                  <div key={index} className="col-span-6">
                    <Text className="my-0">{feature.title}</Text>
                    <Text className="my-0 text-muted-foreground">
                      {feature.label}
                    </Text>
                  </div>
                  <div className="col-span-6">
                    {feature.items.map((item, index) => (
                      <>
                        <Text className="my-0" key={index}>
                          {item}
                        </Text>
                      </>
                    ))}
                  </div>
                  {index < template.features.items.length - 1 && (
                    <div className="col-span-12">
                      <Separator className="my-5" />
                    </div>
                  )}
                </Grid>
              ))}
            </div>
          </Section>
        </div>
      </div>
      <div className="col-span-12 md:col-span-6  ">
        <div className=" mb-5">
          <Section>
            <PlaceholderImage className="bg-muted aspect-[4/3]" />
            {template && (
              <TemplateAccordion templateAccordionItems={template.usage} />
            )}
          </Section>
        </div>
      </div>
      <FullWidthContentContainer className="col-span-12 ">
        <FooterSection />
        <EmailSection />
      </FullWidthContentContainer>
    </Grid>
  );
}
