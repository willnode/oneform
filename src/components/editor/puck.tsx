import { DropZone, dropZoneContext, type Config } from "@measured/puck";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { cssToStyle, twToStyle } from "../helper";
import { buttonVariants } from "../ui/button";
import _ from "lodash-es";
import RM from "react-markdown";
import { parse } from 'yaml';
import React, { createContext, useContext, useMemo } from "react";
import { Liquid } from "liquidjs";
import { client } from "@/api/client";
import { ComponentRender } from "./component";
import * as Fa from "react-icons/fa6";
import type { IconType } from "react-icons";

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

function useTemplArray(arr: { key: string, value: string }[]) {
  let data = useContext(DataContext);
  return useMemo(() => {
    return arr.map(({ key, value }) => {
      if (!value) {
        return { key, value: '' };
      }
      try {
        return { key, value: liquid.parseAndRenderSync(value, data) };
      } catch (error: any) {
        console.error(error);
        return { key, value: 'error evaluating syntax: ' + error?.message };
      }
    });
  }, [data, arr.map(x => x?.value).join()])
}

export const DataContext = createContext<any>({});

const useStyle = (classes: string, style?: string) => {
  return useMemo(() => ({ ...twToStyle(classes), ...cssToStyle(style) }), [classes, style])
}


const config: Config = {
  categories: {
    layout: {
      components: ['Box', 'Data', 'Component']
    },
    visual: {
      components: ['Text', 'Button', 'Card']
    }
  },
  root: {
    fields: {
      title: {
        type: "text",
      },
      description: {
        type: "textarea",
      },
      thumbnail: {
        type: "external",
        
      },
      css: {
        type: "textarea",
      },
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
        icon: {
          type: "select",
          options: opt(Object.keys(Fa))
        },
        variant: {
          type: "select",
          options: opt(["link", "default", "destructive", "outline", "secondary", "ghost"]),
        },
      },
      render: ({ icon, text, link, variant }) => {
        link = useTempl(link);
        // @ts-ignore
        let Icon: IconType = useMemo(() => Fa[icon] || null, [Fa, icon]);
        return <a href={link} className={buttonVariants({
          variant,
        })}>{Icon && <Icon className="me-2" />}{text}</a>
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
        classes: {
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
      render({ title, description, classes, hasFooter }) {
        title = useTempl(title);
        description = useTempl(description);
        classes = useStyle(classes);
        return <Card style={classes}>
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
        let css = useStyle(classes);
        let oldData = useContext(DataContext);

        let dataMock = useMemo(() => {
          return mock.map((m: any) => {
            try {
              return parse(m.data);
            } catch (error) {
              console.error(error);
              return 'YAML mock data error';
            }
          })
        }, [mock]);

        return <div style={css}>{dataMock.map((data: any, i: number) => {
          return <React.Fragment key={i}>
            <DataContext.Provider value={{ ...oldData, ...data }}>
              <DropZone zone="children" />
            </DataContext.Provider>
          </React.Fragment>
        })}</div>;
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
    },
    Component: {
      fields: {
        component: {
          type: "external",
          fetchList: async () => {
            // ... fetch data from a third party API, or other async source
            let r = await client.api["view-component"].get.$get();
            let rw = await r.json();
            if (rw.status == 'error') return [];
            return rw.data.map(x => ({ identifier: x.identifier, title: x.title, id: x.id, schema: x.schema, }));
          },
          mapRow: (item) => ({ identifier: item.identifier, title: item.title }),
          getItemSummary: (x) => x.identifier,
        },
        data: {
          type: "array",
          arrayFields: {
            key: {
              type: "text",
            },
            value: {
              type: "text",
            }
          }
        }
      },
      render({ component, data }) {
        let ctx = useContext(dropZoneContext);
        data = useTemplArray(data);
        if (ctx?.mode == "edit") {
          return <div>Custom component {`<${component.identifier} />`} will render here</div>;
        } else {
          return <ComponentRender component={component} data={data} />;
        }
      }
    }
  },
};

export default config;