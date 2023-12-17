😍😍测试🤤🤤我的测试🤤
<a name="exJD8"></a>
# jest断言
<a name="JqVBk"></a>
## 基础知识

1. test用于定义单个的用例，与此类似的有describe和it，describe表示一组分组，其中可以包含多个test，而it是test的别名，有相同的作用
```typescript
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

describe("test", () => {
  test("first unit test", () => {
    render(<App />);
    expect(screen.getByText("Vite + React")).toBeInTheDocument();
  });
});

```

- 如上，在describe的回调中可以包含多组test。在这个单测中我们判断了vite+react是否在我们的DOM中，`screen.getByText`用于元素的查找。
- 再看这行代码`expect(screen.getByText("Vite + React")).toBeInTheDocument();`，表示的是期望(expect)`screen.getByText("vite + react")`这个元素`toBeInTheDocument`(可以在页面正文)
- 稍微总结一下，expect其中的参数填入你需要进行判断的对象，`toBeInTheDocument`这个api是匹配器。也称断言，用来告诉程序你的预期是什么，通过对预期的对象进行断言就是单元测试的基本原理
2. 常见断言场景
| **场景方向** | 涉及的断言Api |
| --- | --- |
| 基础类型的比较 | `not``toBe(value)`<br />`toBeTruthy(value)`<br />`toBeDefined()`<br />`toBeUndefined()`<br />`toBeCloseTo(value)`<br />`toBeNaN()` |
| 引用类型的比较 | `toEqual(value)` |
| 数字符号 | `**toBeGreaterThan(value)** `<br />`toBeLessThan(value) `<br />`toBeGreaterThanOrEqual(value)`<br /> `toBeLessThanOrEqual(value)` |
| 正则匹配 | `toMatch(value) `<br />`toMatchObject(value)` |
| 表单验证 | `toContain(value) `<br />`arrayContaining(value) `<br />`toContainEqual(value) `<br />`toHaveLength(value) `<br />`toHaveProperty(value)` |
| 错误抛出 | `toThrow() `<br />`toThrowError()` |

<a name="EWRr2"></a>
## 基础类型的比较

1. 常规用法
- `toBe`：在基础类型中，大部分比较都可以通过toBe来完成，包括booolean和undefined
```typescript
test("基础类型的比较", () => {
    // tobe
    expect(1 + 1).toBe(2);
    // not，not用来表示非的判断
    expect(1 + 1).not.toBe(3);
})
```
也可以对函数返回的类型进行判断
```typescript
import React from "react";
test("基础类型的比较", () => {
  const test = () => {
    console.log("wujiayu");
  };
  expect(test()).toBe(undefined);
});

```
需要注意的是，toBe无法对浮点类型进行断言，应该使用`toBeCloseTo()`,这个断言用来判断对象和预期的精度是否足够接近，而不再是全等
<a name="uvI8G"></a>
## 引用类型的断言
`toEqual`：`toEqual`会深度递归对象的每个属性，进行深度比较，只要原始值相同，就可以通过断言
```typescript
test("引用类型的比较", () => {
  const a = {
    obj1: {
      name: "obj1",
      obj2: {
        name: "obj2",
      },
    },
  };
  const b = Object.assign(a); // 浅
  const c = JSON.parse(JSON.stringify(a)); // 深

  expect(a).toBe(b); // √
  expect(a).not.toBe(c); // √
  expect(a).toEqual(b); // √ 
  expect(a).toEqual(c); // √
});
```
注：toEqual也可以用于基础类型的比较
<a name="I8HVw"></a>
## 数字符号的断言
```typescript
test("数字符号的断言", () => {
  // <
  expect(2).toBeLessThan(3);  // 其它符号同理
});
```
<a name="PTmaF"></a>
## 正则匹配
```typescript
test("正则匹配", () => {
  expect("this is a regexp").toMatch(/regexp/);
  const obj = { prop1: "test", prop2: "regexp validation" };
  const childObj = { prop1: "test" };
  expect(obj).toMatchObject(childObj);
});
```

- `toMatch(regexp)`会匹配字符串是否能够满足正则的验证
- `toMatchObject(value)`用来验证对象能否包含value的全部属性，即value是否是匹配对象的子集
<a name="RdBWg"></a>
## 表单验证

- `toContain(value)`：判定某个值是否存在在数组中
- `arrayContaining(value)`：匹配接收到的数组，与toEqual结合使用可以用于判定某个数组是否是另一个数组的子集
- `toContainEqual(value)`：用于判定某个对象元素是否在数组中
- `toHaveLength(value)`： 断言数组的长度
- `toHaveProperty(value)`：断言对象中是否包含某个属性，针对多层级的对象可以通过xx.yy的方式进行传参断言
```typescript
test("表单验证", () => {
  // 数组元素验证
  expect([1, 2, 3]).toContain(1); // 判断某个值是否存在数组中
  expect([1, 2, 3]).toEqual(expect.arrayContaining([1, 2])); // 与toEqual结合使用可以判定某个数组是否是另一个数组的子集
  expect([{ a: 1, b: 2 }]).toContainEqual({ a: 1, b: 2 }); // 用于判定某个对象元素是否在数组中
  // 数组长度
  expect([1, 2, 3]).toHaveLength(3); // 断言数组的长度
  // 对象属性验证
  const testObj = {
    prop1: 1,
    prop2: {
      child1: 2,
      child2: "test",
    },
  };
  expect(testObj).toHaveProperty("prop1"); // 断言某个对象是否含有某个属性
  expect(testObj).toHaveProperty("prop2.child1"); // 针对多层级的对象可以使用xx.yy的方式进行传参断言
});
```
<a name="QOS5t"></a>
## 错误抛出
```typescript
// 存在toThrowError()和toThrow()两个匹配器，用法一样，可以理解为另一个别名
test("错误捕获", () => {
  const throwError = () => {
    const err = new Error("error: cqupt is door");
    throw err;
  };
  expect(throwError).toThrowError();
  expect(throwError).toThrow();

  const catchError = () => {
    try {
      const err = new Error("console err: this is a test error!");
      throw err;
    } catch (err) {
      console.log(err);
    }
  };
  expect(catchError).not.toThrow();
  expect(catchError).not.toThrowError();
});
```
<a name="eGfFd"></a>
## 实现自定义的断言
使用extend，一个简单的demo：
```typescript
test("同步自定义匹配器", () => {
    const toBeBetweenZeroAndTen = (num: number) => {
      if (num >= 0 && num <= 10) {
        return {
          message: () => "",
          pass: true,
        };
      } else {
        return {
          message: () => "expected num to be a number between zero and ten",
          pass: false,
        };
      }
    };
    expect.extend({
      toBeBetweenZeroAndTen,
    });
    expect(8).toBeBetweenZeroAndTen();
    expect(11).not.toBeBetweenZeroAndTen();
  });
```
<a name="KIwWn"></a>
# DOM查询：页面元素的渲染和行为查询
<a name="b0ufs"></a>
## 页面元素的渲染
<a name="G9rOl"></a>
### render

- render用于元素的渲染，并且在render执行之后会把值注入到screen对象中，如同上面第一个例子
```typescript
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

describe("test", () => {
  test("first unit test", () => {
    render(<App />);
    expect(screen.getByText("Vite + React")).toBeInTheDocument();
  });
});

```

- render函数需要放在每个独立的test中，因为在每个test执行完以后，library会调用cleanup方法来清理环境
<a name="SHYpW"></a>
## 页面元素的查询

1. 分类：getBy getAllBy; queryBy  queryAllBy; findBy findAllBy;
2. 不同点：
- Get：返回查询的匹配节点，如果没有元素匹配则会报错(针对单查如果查到多个也会报错)
- Query：返回查询的匹配节点，如果没有元素匹配会返回null，但是不会报错(同样针对单查，如果查到多个匹配元素也会报错)
- Find：返回一个Promise，默认超时时间为1000ms，如果没有元素匹配或者查找超时，Promise状态切为reject(同样针对单查，如果查到多个元素，也会返回reject)
3. 当某个元素的存在并不决定这个用例能不能通过，那就使用query；如果某个元素不存在，后续的步骤就没有执行的意义，那就使用get来直接中断这个用例
4. 例子
```typescript
import { FC } from "react";

interface IProps {}

export const DomQuery: FC<IProps> = ({}) => {
  return (
    <div>
      <div>test1</div>
      <div>test2</div>
    </div>
  );
};
```
```typescript
import React from "react";
import { render, screen } from "@testing-library/react";
import { DomQuery } from "../components/DomQuery";

describe("tests for", () => {
  test("get & query & find", () => {
    render(<DomQuery />);
    const element = screen.getByText(/test/i); // 报错：找到多个元素
    screen.debug(element);
  });
});
```
screen.debug是暴露出来的一个调试api，可以将查询出来的元素在控制台上显示
<a name="EPGsy"></a>
# DOM查询：页面元素的参照物查询和优先级
<a name="GjrQJ"></a>
## 按照参照物分类
<a name="Uaxn2"></a>
### role  ARIA

- 比如div、button等标签，即使没有加任何属性，也有一个隐形的ARIA role属性来表示它的语义。
| 标签 | 隐形ARIA role |
| --- | --- |
| a ,href | link |
| a(无href) body div span | generic |
| form | form |
| h1-h6 | heading |
| html | document |
| img | img |
| p | paragraph |
| table | table |
| ul | list |
| li | listitem |

aria与role配合使用
```typescript
function App() {
  return (
    <div >
      <button aria-pressed>wujiayu</button>
    </div>
  );
}

export default App;

```
```typescript
import Button from "../App";
import { render, screen } from "@testing-library/react";

test("test role", () => {
  render(<Button />);
  const button = screen.getByRole("button", {pressed: true});
  screen.debug(button);
});
```

- aria属性用来表示对应角色下的额外特殊含义，可以在多个相同角色找那个选中我们需要的一个

`aria-hidden`:不在DOM树上访问的元素<br />`aria-selected`:元素是否被选中<br />`aria-checked`：元素是否被勾选<br />`aria-current`：当前选中的元素<br />`aria-pressed`：被按压的元素<br />`aria-expanded`：元素是否被展开<br />`aria-level`：区域的等级，h1-h6会有默认的aria-level属性，值对应1-6<br />`aria-describedby`：可以通过描述来定位额外的元素

- 例子
```typescript
function App() {
  return (
    <div >
       <button aria-describedby="description">
          <div id="description">自定义aria按钮</div>
        </button>
    </div>
  );
}

export default App;
```
```typescript
import Button from "../App";
import { render, screen } from "@testing-library/react";

test("test role", () => {
  render(<Button />);
   const button = screen.getByRole("button", {
      description: "自定义aria按钮",
    });
  screen.debug(button);
});
```

- 筛选项：name；通过这个和aria-label搭配使用筛选出我们需要的内容
```typescript
import { FC } from "react";

interface IProps {}

export const DomQuery: FC<IProps> = ({}) => {
  return (
    <div>
      <div aria-label="test_note">1234</div>
    </div>
  );
};
```
```typescript
import React from "react";
import { render, screen } from "@testing-library/react";
import { DomQuery } from "../components/DomQuery";

describe("tests for", () => {
  // ...
  test("aria-label", () => {
    render(<DomQuery />);
    const note = screen.getByRole("generic", { name: "test_note" });
    screen.debug(note);
  });
});
```
<a name="gTCt3"></a>
## 其它参照物

- 标签文本：针对label标签的text查询

`const label = screen.getByLabelText("testLabel") `

- 占位符文本(placeholdertext):通过placeholder来查询

`**const** placeholderInput = screen.**getByPlaceholderText**( "a query by placeholder" );`

- 表单value(displayValue):根据表单元素的值来查询

`const valueInput = screen.getByDisPlayValue("a query by value")`
<a name="OnZf6"></a>
## 查询的优先级

- 主动使用：getByRole、getByLabelText等
- 考虑使用：getByAltText、getByTitle等
- 尽量不用：getByTestId等
<a name="YGP79"></a>
# 页面元素的断言
| 断言使用场景 | 断言API |
| --- | --- |
| 页面可见 | `toBeEmptyDOMElement  `<br />`toBeVisible `<br />`toBeInTheDocument`<br />`toHaveTextContent` |
| 表单验证 | `toBeDisabled `<br />`toBeEnabled `<br />`toBeRequired `<br />`toHaveFocus `<br />`toBeChecked `<br />`toHaveFormValues `<br />`toHaveValue` |
| 代码层面验证 | `toHaveAttribute `<br />`toHaveClass `<br />`toHaveStyle` |

<a name="MKOTr"></a>
## 页面可见
<a name="J7LAf"></a>
### toBeEmptyDOMElement
标签之间是否有可见内容，即使是空格也会失败<br />`**expect**(emptyNote).**toBeEmptyDOMElement**();`
<a name="vGa2g"></a>
### toBeVisible
是否可见，从用户直接观察的角度看能否看见
<a name="pcLfW"></a>
### toBeInTheDocument
是否存在文档中，document.body是否存在这个元素

- 注意：当需要查询`hidden：true`的元素时，大部分情况下需要使用getAll；因为连带`hidden：false`的元素会一起被查询出来。即：`hidden：true`并不是选取hidden属性为true的元素，而是是否需要查询hidden属性为true的元素
<a name="fJtr1"></a>
## 表单验证
| `toBeDisabled ` | 检查元素是否通过 disable 属性判断，而不是 aria-disabled； |
| --- | --- |
| `toBeEnabled ` | 是否未被禁用，等同于 <br />`.not.toBeDisabled` |
| `toBeRequired ` | 元素是否必填 |
| `toHaveFocus ` | 元素是否聚焦 |
| `toBeChecked ` | checkbox或者是radio是否被选中 |
| `toHaveFormValues ` | 验证整体表单的值是否和预期相同 |
| `toHaveValue` | 与前一个类似，不过这个验证某个单独的表单元素，而不是全部 |

- 注意：对于form元素，虽然必须加上aria-label才可以使用`screen。getByRole("form")`进行筛选
<a name="XDIo2"></a>
## 代码层面验证
<a name="jFnjX"></a>
### toHaveAttribute
匹配元素是否具备某个值的属性<br />`**expect**(hiddenNote).**toHaveAttribute**("aria-hidden");`
<a name="MkD6U"></a>
### toHaveClass
匹配元素在类属性中是否包含某个类
<a name="avllQ"></a>
### toHaveStyle
匹配元素是否具有对应样式
<a name="vyYDn"></a>
# 对DOM组件绑定事件进行模拟触发
<a name="bZRio"></a>
## fireEvent
如：`age.focus()` ==>> `fireEvent.focus()`<br />除了eventName,还有一个node和eventProperties，node可以接收一个我们查询出来的对象，而eventProperities则是描述这个具体事件的属性<br />如：`fireEvent.click(screen.getByRole("note"))`

- 对于事件的用例，通常会使用jest提供的mock事件，以及`toBeCalled`和`toBeCalledTimes`两个断言，`toBeCalled`用来判断mock事件是否被调用，`toBeCalledTimes`用来判断mock事件被调用的次数

如： `expect(clickEvent).toBeCalled();`
<a name="MIXZX"></a>
## userEvent

- userEvent与fireEvent的不同：后者只是在调度一个DOM事件，例如在点击按钮时的先hover再聚焦并不会在fireEvent中体现出来；而前者则是在模拟完整的事件流程，会触发hover等事件效果
- 写法：`userEvent.click(screen.getByRole("note"))`
<a name="YiDCS"></a>
# 测试异步逻辑
<a name="m1T4Z"></a>
## expect的值异步
```typescript
describe("examples for async", () => {
  test("for jest", async () => {
    const fetchData = async () => {
      const res = await new Promise((resolve) =>
        resolve("this is a demo for fetching data")
      );
      return res;
    };
    const data = await fetchData();
    expect(data).toBe("this is a demo for fetching data");
  });
});
```
除了这种写法，我们也可以使用jest提供的resolves和reject来进行异步逻辑的断言
```typescript
describe("examples for async", () => {
  test("for jest", async () => {
    const fetchData = async () => {
      const res = await new Promise((resolve) =>
        resolve("this is a demo for fetching data")
      );
      return res;
    };
    const data = await fetchData();
    expect(data).toBe("this is a demo for fetching data");
    await expect(fetchData()).resolves.toBe("this is a demo for fetching data");
    // await expect(fetchData()).rejects.toBe('this is a demo for fetching data');
  });
});
```
<a name="exsBC"></a>
## React Testing library异步
<a name="aFm3K"></a>
### findBy和findAllBy
当我们定义一个组件在500ms之后加载时，我们使用get或者query是不能查询到的，这时候我们就需要使用findBy和findAllBy。这两个api会重复执行回调去查找对应的元素，指导超过默认的1000ms，对于这个组件，我们就可以使用findBy来写用例
```typescript
describe("examples for async", () => {
  // ... other content
  
  test("for react testing library", async () => {
    render(<DomAsync />);
    const testDom = await screen.findByText("a demo for async test");
    expect(testDom).toBeInTheDocument();
  });
});
```
<a name="kc721"></a>
### waitfor
waitfor接收两个参数，第一个是需要重复执行的回调函数，我们可以在其中查询元素并且断言。waitfor会根据设定的超时时间和执行间隔来重复执行回调。第二个参数是可以配置的数据，比如说超时时间(timeout)、执行间隔(interval)，通过这个参数我们就可以自定义我们需要的超时场景
```typescript
describe("examples for async", () => {
  
  test("for react testing library", async () => {
    render(<DomAsync />);
    const testDom = await screen.findByText("a demo for async test");
    expect(testDom).toBeInTheDocument();
    await waitFor(
      () => {
        const waitTestDom = screen.getByText("a demo for async test");
        expect(waitTestDom).toBeInTheDocument();
      },
      {
        timeout: 1000,
        interval: 100,
      }
    );
  });
```
<a name="bvcak"></a>
### waitForElementToBeRemoved
对于上一个例子来说，我们也需要实现当文案展示的时候隐藏加载中的文案，可以使用waitForElementToRemoved<br />函数接收两个参数，一个是callback，对于这个参数我们可以传入元素本身，或者返回一个返回值为元素的回调函数，第二个参数和waitfor的第二个参数相同
```typescript
describe("examples for async", () => {
  
  test("for react testing library", async () => {
    render(<DomAsync />);
    waitForElementToBeRemoved(screen.queryByText("加载中...")).then(() => {
      console.log("元素加载完成");
    });
    const testDom = await screen.findByText("a demo for async test");
    expect(testDom).toBeInTheDocument();
    await waitFor(
      () => {
        const waitTestDom = screen.getByText("a demo for async test");
        expect(waitTestDom).toBeInTheDocument();
      },
      {
        timeout: 1000,
        interval: 100,
      }
    );
  });
});
```
需要注意的是，对于waitForElementToBeRemoved需要判断的DOM元素，我们应该使用queryBy来查询而不是getBy。getBy在未查询到指定元素时，会抛出错误
<a name="cm2XS"></a>
# 快进测试定时任务
<a name="uxj7l"></a>
## Fake Times API

- `useFakeTimers`:启用假定时器
- `useRealTimes`：启用真定时器
- `runAllTimers`：运行所有定时器
- `runOnlyPendingTimers`：只运行等待的定时器
- `advanceTimersByTime`：提前具体毫秒执行
```typescript
import React from "react";
import { sleep } from "../components/FakeTimer";

// 9 | FakeTimer：如何"快进"测试定时任务？
describe("examples for fakeTimers", () => {
  // 将所有的定时器替换为假定时器
  beforeAll(() => {
    jest.useFakeTimers();
  });

  // 运行所有的定时器
  test("a test for a controllable setTimeout", async () => {
    const res = sleep(6000, "this is a controllable setTimeout");
    // 将所有的定时器提前指定时间
    jest.advanceTimersByTime(6000);
    await expect(res).resolves.toBe("this is a controllable setTimeout");
  });
});
```
<a name="svljE"></a>
## 递归场景的定时快进

1. 如果定时器在递归的场景中，还是使用runAlltimes()，就会造成栈溢出的情况。因为jest.runAllTimers()会运行所有的定时器，但是因为递归的关系，当定时完成后，始终会有一次新的定时，所以会导致栈溢出
```typescript
const loopSleep = async (time: number, result: string): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(result);
      setTimeout(() => {
        loopSleep(time, result);
      }, time);
    }, time);
  });
};
```

2. 针对上述情况，可以使用runOnlyPendingTimers，它只会运行目前挂起的定时器
```typescript
describe("examples for fakeTimers", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  // ... other content
  test("a test for a recursion setTimeout", async () => {
    const res = loopSleep(6000, "this is a recursion setTimeout test");
    // jest.runAllTimers();
    jest.runOnlyPendingTimers();
    await expect(res).resolves.toBe("this is a recursion setTimeout test");
  });
});
```
<a name="hcDRx"></a>
# Mock:怎么替代不需要关注的逻辑
<a name="yrqlD"></a>
## 全局Mock
`jest.mock(path, moduleFactory)`:其中path是需要mock的文件路径，moduleFactory是这个模块的工厂函数，类型与模块保持一致。
```typescript
import React from "react";
import axios from "axios";

jest.mock("axios");

describe("examples for mock", () => {
  test("a test for global mock", async () => {
    const res = "this is a test for global mock";
    axios.get.mockResolvedValue(res);
    const data = await axios.get("/");
    expect(data).toBe("this is a test for global mock");
  });
});
```
<a name="ozb0e"></a>
## 单次Mock

- jest对于单次mock提供了一个与mock对应的方法——doMock

`jest.doMock(moduleName, factory, options)`
```typescript
const mock = {
  getMockData: () => {
    return "oldMockData";
  },
};

export default mock;
```
```typescript
import React from "react";
import mock from "../components/Mock";

// 10 | Mock: 怎么替代不那么重要的逻辑？
describe("examples for mock", () => {
  test("a test for single mock", () => {
    jest.doMock("../components/Mock", () => ({  // 填路径，直接填mock会报错
      __esModule: true,
      getMockData: () => {
        return "newMockData";
      },
    }));
    // expect(mock.getMockData()).toBe("newMockData");
    const mock = require("../components/Mock"); // 路径
    expect(mock.getMockData()).toBe("newMockData");
  });
});
```

- _esModule: true:因为上面定义的mock模块是通过esmodule导出的，所以需要加上这个属性帮助jest进行mock
- require("../components/Mock")：如果直接在全局定义，然后调用是不可以的，因为doMock只会对这一个test生效，而不会提升到import之前去覆写原有模块，所以需要采用在用例内require的方式导入，直接import的模块还会是原来的文件，并不会生效mock
<a name="xNwKe"></a>
## Mock函数
两个常用的function进行函数的mock

- `jest.fn(implementation?)`:用于mock一个空函数，不同的是它可以追踪目标函数的调用，使得它的入参和回参内容，例如jest.fn<string, string>()就对应一个入参和回参都为string的mock函数
- `jest.spyOn(object, methodName)`：创建一个和jest.fn类似的mock函数，不同的是它可以追踪目标函数的调用，使得它的入参和回参与需要mock的函数是自动匹配的，对于全局mock中的那个类型问题，我们就可以使用jest.spyon来解决
1. 用`jest.spyon`解决全局mock中的类型问题
```typescript
import React from "react";
import axios from "axios";

jest.mock("axios");

// 10 | Mock: 怎么替代不那么重要的逻辑？
describe("examples for mock", () => {
  test("a test for global mock", async () => {
    const res = "this is a test for global mock";
    // axios.get.mockResolvedValue(res);
    jest.spyOn(axios, "get").mockResolvedValue(res);
    const data = await axios.get("/");
    expect(data).toBe("this is a test for global mock");
  });
});
```

2. 用`jest.spyon`改写单次mock
```typescript
import React from "react";
import mock from "../components/Mock";

describe("examples for mock", () => {
  // ...other

  test("other ways for single mock", () => {
    jest.spyOn(mock, "getMockData").mockReturnValue("newMockData");
    expect(mock.getMockData()).toBe("newMockData");
  });
});
```
<a name="eqkDK"></a>
# 怎么测试hook
<a name="pwBEr"></a>
## 从组件维度进行覆盖
```typescript
import {useCallback, useState} from 'react';
const useCount = () => {
  const [num, setNum] = useState(0);

  const increase = useCallback(() => {
    setNum(num + 1);
  }, []);

  return { num, increase };
};

export default useCount;
```
```typescript
import { FC } from "react";
import useCount from "./useCount";

interface IProps {}

export const RenderHook: FC<IProps> = ({}) => {
  const { num, increase } = useCount();

  return (
    <div>
      <span role="note">{num}</span>
      <button onClick={increase}>增加</button>
    </div>
  );
};
```
通过测试RenderHook的能力来推断useCount是否符合预期
```typescript
import React from "react";
import { render, screen} from "@testing-library/react";
import useCount from "../components/RenderHook/useCount";
import { RenderHook } from "../components/RenderHook";
import userEvent from "@testing-library/user-event";

// 11 | RenderHook：怎么测试React hook？
describe("examples for render hook", () => {
  test("a test for component with useCount", () => {
    render(<RenderHook />);
    const note = screen.getByRole("note");
    expect(note).toHaveTextContent("0");
    userEvent.click(screen.getByRole("button"));
    expect(note).toHaveTextContent("1");
  });
});
```
<a name="dVkgi"></a>
## 对公共hook的测试
使用testing-library自带的renderhook
```typescript
import React from "react";
import { render, screen, renderHook } from "@testing-library/react";
import useCount from "../components/RenderHook/useCount";
import { RenderHook } from "../components/RenderHook";
import { act } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";

describe("examples for render hook", () => {
  test("a test for useCount", () => {
    const { result } = renderHook(() => useCount());
    act(() => {
      result.current.increase();
    });
    expect(result.current.num).toBe(1);
  });
});
```
act()可以确保断言执行时UI已经被执行完毕（建议写上，写了不会出错）
<a name="vmmE3"></a>
# 保障UI组件的完整性
<a name="tIfiy"></a>
## 通过快照测试

- 会生成一个snapshots目录用来存放快照文件
```typescript
import React from "react";
import { render, screen } from "@testing-library/react";
import { DomSnap } from "../components/DomSnap";

// 全局
describe("examples for snap", () => {
  test("a test for component snap", () => {
    const { baseElement } = render(<DomSnap />);
    expect(baseElement).toMatchSnapshot();
  });

  // 部分
  test("a test for part component snap", () => {
    render(<DomSnap />);
    expect(
      screen.getByRole("textbox", { name: "form_username" })
    ).toMatchSnapshot();
  });
});
```
也可以看看Alert组件编写的快照测试。
<a name="NcMVg"></a>
## 使用场景
更适合使用在不轻易改变，甚至不会去改变的公告逻辑中，比如抽取出来的组件
