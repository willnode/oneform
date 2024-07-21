import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DropZone, dropZoneContext, Puck, type Config, type Data } from "@measured/puck";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { cssToStyle, twToStyle } from "../helper";
import { Button, buttonVariants } from "../ui/button";
import _, { forEach } from "lodash-es";
import RM from "react-markdown";
import { parse } from 'yaml';
import React, { createContext, useContext, useMemo } from "react";
import jexl from "jexl";
import { Liquid } from "liquidjs";

function opt(arr: string[]) {
  return arr.map(x => ({ label: _.startCase(x), value: x }));
}
function bool() {
  return [{ label: 'Yes', value: 'y' }, { label: 'No', value: '' }]
}
const liquid = new Liquid();

function useTempl(str: string) {
  let data = useContext(DataContext);
  return useMemo(() => {
    if (!str) {
      return '';
    }
    try {
      return liquid.parseAndRenderSync(str, data);
    } catch (error: any) {
      console.error(error);
      return 'error evaluating syntax: ' + error?.message;
    }
  }, [data, str])
}

const DataContext = createContext<any>({});

const useStyle = (classes: string, style?: string) => {
  return useMemo(() => ({ ...twToStyle(classes), ...cssToStyle(style) }), [classes, style])
}


const config: Config = {
  categories: {
    layout: {
      components: ['Box', 'Text']
    }
  },
  components: {
    Box: {
      fields: {
        classes: {
          type: "text",
        },
        style: {
          type: "textarea",
        },
      },
      render: ({ classes, style }) => {
        let ctx = useContext(dropZoneContext);
        let css = useStyle(classes, style);
        if (ctx && ctx.mode == "edit") {
          return <DropZone style={css} zone="children" />
        } else {
          return <div style={css}>
            <DropZone zone="children" />
          </div>
        }
      },
    },
    Button: {
      defaultProps: {
        text: "Button",
      },
      fields: {
        text: {
          type: "text",
        },
        link: {
          type: "text",
        },
        variant: {
          type: "select",
          options: opt(["link", "default", "destructive", "outline", "secondary", "ghost"]),
        },
      },
      render: ({ text, link, variant }) => {
        link = useTempl(link);
        return <a href={link} className={buttonVariants({
          variant,
        })}>{text}</a>
      },
    },
    Card: {
      defaultProps: {
        title: "Card Here"
      },
      fields: {
        title: {
          type: "text",
        },
        description: {
          type: "text",
        },
        hasFooter: {
          type: "radio",
          options: [{
            "label": "Yes",
            value: "y",
          }, {
            label: "No",
            value: ""
          }]
        }
      },
      render({ title, description, hasFooter }) {
        title = useTempl(title);
        description = useTempl(description);
        return <Card>
          {title && <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>}
          <CardContent>
            <DropZone zone="children" />
          </CardContent>
          {hasFooter && <CardFooter className="flex justify-between">
            <DropZone zone="footer" />
          </CardFooter>}
        </Card>
      }
    },
    Data: {
      defaultProps: {
        classes: "flex flex-row",
        mock: [{
          data: 'title: YAML data here'
        }]
      },
      fields: {
        classes: {
          type: "text",
        },
        api: {
          type: "text",
        },
        mock: {
          type: "array",
          arrayFields: {
            data: { type: "textarea", }
          },
        },
      },
      render({ mock, classes }) {
        let renderData: React.ReactNode[] = [];
        let css = useStyle(classes);

        mock.forEach((el: any, i: number) => {
          let data = useMemo(() => {
            try {
              return parse(el.data);
            } catch (error) {
              console.error(error);
              return <div>YAML mock data error</div>
            }
          }, [el.data])
          renderData.push(<React.Fragment key={i}>
            <DataContext.Provider value={data}>
              <DropZone zone="children" />
            </DataContext.Provider>
          </React.Fragment>)
        });

        return <div style={css}>{renderData}</div>;
      }
    },
    Text: {
      defaultProps: {
        text: "Text Here",
        mode: 'prose',
      },
      fields: {
        text: {
          type: "textarea",
        },
        mode: {
          type: "radio",
          options: opt(['text', 'prose'])
        },
        classes: {
          type: "text",
        },
      },
      render({ text, classes, mode }) {
        text = useTempl(text);
        let css = useStyle(classes);
        switch (mode) {
          case 'prose':
            return <div className="prose dark:prose-invert" style={css} >
              <RM>{text}</RM>
            </div>
          case 'text':
          default:
            return <div style={css} >{text}</div>;
        }
      }
    }
  },
};

export default config;