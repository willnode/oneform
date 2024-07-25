import { AutoField, DropZone, dropZoneContext, FieldLabel, type Config, type CustomField } from "@measured/puck";
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
import { Badge } from "../ui/badge";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

function opt(arr: string[]) {
  return arr.map(x => ({ label: _.startCase(x || '[Empty]'), value: x }));
}
function bool(): any[] {
  return [{ label: 'Yes', value: 'y' }, { label: 'No', value: undefined }]
}
const variants = ["default", "secondary", "destructive", "warning", "success", "info", "outline"];
const icons = ["", ...Object.keys(Fa)];
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
  }, [data, (arr?.map(x => x?.value).join() || '')])
}

export const DataContext = createContext<any>({});

const useStyle = (classes: string, style?: string) => {
  return useMemo(() => ({ ...twToStyle(classes), ...cssToStyle(style) }), [classes, style])
}

const fileSelectionRender = ({ field, onChange, value }: {
  field: CustomField<any>;
  name: string;
  id: string;
  value: any;
  onChange: (value: any) => void;
  readOnly?: boolean;
}) => {
  return <FieldLabel label={field.label || 'Thumbnail'}>
    <AutoField
      field={{ type: "text" }}
      onChange={(value) => onChange(value)}
      value={value}
    />
    <AutoField
      field={{
        type: "external", fetchList: async () => {
          // ... fetch data from a third party API, or other async source
          let r = await client.api.file.get.$get();
          let rw = await r.json();
          if (rw.status == 'error') return [];
          return rw.data.map(x => ({ id: x.id, type: x.type, name: x.name }));
        },
      }}
      onChange={(value) => onChange(value ? `/upload/file/${value.id}/${value.name}` : '')}
      value={value}
    />
  </FieldLabel >
}

const config: Config = {
  categories: {
    layout: {
      components: ['Box', 'Data', 'Component']
    },
    content: {
      components: ['Text', 'Image', 'Button']
    },
    visual: {
      components: ['Card', 'Alert', 'Badge']
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
        type: "custom",
        render: fileSelectionRender,
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
          options: opt(icons)
        },
        variant: {
          type: "select",
          options: opt([...variants, "ghost", "link"]),
        },
        classes: {
          type: "text",
        },
      },
      render: ({ icon, text, link, classes, variant }) => {
        link = useTempl(link);
        text = useTempl(text);
        let style = useStyle(classes);
        // @ts-ignore
        let Icon: IconType = useMemo(() => Fa[icon] || null, [Fa, icon]);
        return <a href={link} className={buttonVariants({
          variant,
        })} style={style}>{Icon && <Icon className={text && "me-2"} />}{text}</a>
      },
    },
    Badge: {
      defaultProps: {
        text: "Badge",
      },
      fields: {
        text: {
          type: "text",
        },
        icon: {
          type: "select",
          options: opt(icons)
        },
        variant: {
          type: "select",
          options: opt([...variants]),
        },
        classes: {
          type: "text",
        },
      },
      render: ({ icon, text, classes, variant }) => {
        text = useTempl(text);
        let style = useStyle(classes);
        // @ts-ignore
        let Icon: IconType = useMemo(() => Fa[icon] || null, [Fa, icon]);
        return <Badge variant={variant} style={style}>{Icon && <Icon className={text && "me-2"} />}{text}</Badge>
      },
    },
    Alert: {
      defaultProps: {
        title: "Alert Title",
        description: "Alert Description",
      },
      fields: {
        title: {
          type: "text",
        },
        description: {
          type: "textarea",
        },
        icon: {
          type: "select",
          options: opt(icons)
        },
        variant: {
          type: "select",
          options: opt([...variants]),
        },
        classes: {
          type: "text",
        },
      },
      render: ({ icon, title, description, variant, classes }) => {
        title = useTempl(title);
        description = useTempl(description);
        let style = useStyle(classes);
        // @ts-ignore
        let Icon: IconType = useMemo(() => Fa[icon] || null, [Fa, icon]);
        return <Alert variant={variant} style={style}>{Icon && <Icon className="me-2" />}
          {title && <AlertTitle>{title}</AlertTitle>}
          {description && <AlertDescription>{description}</AlertDescription>}
        </Alert>
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
        hasHeader: {
          type: "radio",
          options: bool(),
        },
        hasFooter: {
          type: "radio",
          options: bool(),
        }
      },
      render({ title, description, classes, hasHeader, hasFooter }) {
        title = useTempl(title);
        description = useTempl(description);
        classes = useStyle(classes);
        return <Card style={classes}>
          <div className={hasHeader ? "flex items-center" : ""}>
            {(title || description) && <CardHeader className={hasHeader ? "flex-grow" : ""}>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>}
            {hasHeader && <div className={(title || description) ? "flex-shrink min-w-24 p-6" : "flex-grow p-6"}> <DropZone zone="header" /> </div>}
          </div>

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
    Image: {
      defaultProps: {
        src: "https://picsum.photos/400/300"
      },
      fields: {
        src: {
          type: "custom",
          render: fileSelectionRender,
        },
        classes: {
          type: "text",
        },
        alt: {
          type: "text",
        },
      },
      render({ src, alt, classes }) {
        src = useTempl(src);
        alt = useTempl(alt);
        let css = useStyle(classes);
        return <img src={src} style={css} alt={alt} />;
      }
    },
    Component: {
      defaultProps: {
        data: [],
      },
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
          return <div>Custom component {`<${component?.identifier || '??'} />`} will render here</div>;
        } else {
          return <ComponentRender component={component} data={data} />;
        }
      }
    }
  },
};

export default config;