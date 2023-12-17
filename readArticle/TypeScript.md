<a name="ZSYNt"></a>
# 基础知识
1. null和undefined都是有意义的类型，在没有开启严格检查的时候，会被视为其他类型的子类型。比如string会被认为包含了null和undefined类型
2. void用于描述一个内部没有return语句；或者没有显示return一个值得函数的返回值
3. `  let k: [string, boolean?, number?] = ["uuu", true, 333]; // 后面加一个问号代表可选参数`
4. 或者：`  let x: [name: string, male: boolean, age?: number] = ["uuu", true, 333]; // 后面加一个问号代表可选参数`
- Object、object、{}区别
5. 在ts中，Object包含了所有的类型，但是对于undefined、null、void 0，需要关闭严格类型检查
6. 与Object不同的是，object代表所有非原始类型的类型，即数组、对象与函数类型这些
7. {}意味着任何非null/undefined的值，使用它和使用any一样恶劣
<a name="rvzHm"></a>
# 掌握字面量类型与枚举
没啥可讲的

1. 使用const声明的变量，其类型会从值推导出最精确的字面量类型
<a name="zhpko"></a>
# 函数与Class中的类型
<a name="F87vF"></a>
## 函数

1. <br />
```typescript
type funcFoo = (name: string) => number;
// 也可以使用interface
interface funcFoostruct {
  (name: string): number
}
  const foo: funcFoo = (name) => {
    return name.length;
  };
```

2. <br />
```typescript
function func(foo: number, bar: true): string; // 传入 bar 的值为 true 时，函数返回值为 string 类型。
function func(foo: number, bar?: false): number; // 重载签名二，不传入 bar，或传入 bar 的值为 false 时，函数返回值为 number 类型。
// 函数的实现签名，会包含重载签名的所有可能情况
function func(foo: number, bar?: boolean): string | number {
  if (bar) {
    return String(foo);
  } else {
    return foo * 599;
  }
}
```

3. <br />
```typescript
async function asyncFunc(): Promise<void> {} // async标记的函数其返回值必定为一个Promise类型
```
<a name="upBmT"></a>
## Class

1. 修饰符

       在 TypeScript 中我们能够为 Class 成员添加这些修饰符：`public``private``protected`。除 readonly 以外，其他三位都属于访问性修饰符，而 readonly 属于操作性修饰符（就和 interface 中的 readonly 意义一致）

- 通常不会为构造函数添加修饰符
- public: 此类成员在类、类的实例、子类中都能被访问
- private：此类成员仅能在类的内部被访问
- protected：此类成员仅能在类与子类中被访问
2. 接口
```typescript
interface ClockTime {
    currentTime: Date;
    setTime(d: Date);
  }
  class clock implements ClockTime {
    currentTime: Date;
    setTime(d: Date) {
      this.currentTime = d;
    }
    constructor(h: number, m: number) {}
  }
```

3. 静态成员： 使用static关键字；来标识一个成员为静态成员

       在类的内部静态成员无法通过this来访问，需要通过.运算符来进行访问。静态成员不会被实例继承，它始终只属于当前定义的这个类(以及其子类)

4. 基类与派生类
```typescript
class Base {
    print() {}
  }

// 使用了override关键字，确保派生类尝试覆盖的方法一定在基类中存在定义，如果未在基类中声明则会报错
  class Derived extends Base {
    override print() {
      super.print();
      // ...
    }
  }
```
<a name="tGrxW"></a>
# 探秘内置类型：any、unknown与never

1. 表达位置类型——使用unknown；一个unknown类型的变量可以再次赋值为任意其它类型，但只能赋值给any与unknown类型的变量
2. 要对unknown类型进行属性访问，需要进行类型断言
```typescript
namespace A {
  let unknownVar: unknown;
  (unknownVar as { foo: () => {} }).foo(); // 断言
}
```

3. never：never不携带任何的类型信息，因此会在联合类型中被直接移除
<a name="Bfh4E"></a>
## 类型断言
```typescript
  //   将unknown断言为一个具体的类型
  let unknownVar: unknown;
  (unknownVar as { foo: () => {} }).foo();

  //   as到any来为所欲为，跳过所有的类型检查
  const str: string = "linbubu";
  (str as any).func().foo().prop;

  //   在联合类型中断言一个具体的分支
  function foo(union: string | number) {
    if ((union as string).includes("linbubu")) {
    }
    if ((union as number).toFixed() === "599") {
    }
  }
```

1. 双重断言：在使用类型断言时，原类型与断言类型之间差异过大，ts就会给一个类型报错
2. 非空断言：使用！语法，即`obj.func()!.prop`的形式标记前面的一个声明一定是非空的
```typescript
  declare const fooFoo: {
    func?: () => {
      prop?: number | null;
    };
  };
  fooFoo.func().prop?.toFixed(); // 这样使用就会报错
  fooFoo.func!().prop!.toFixed; // 使用非空断言

```

3. 非空断言与可选链的不同：非空断言的运行时仍然会保持调用链，因此在运行时可能会报错。而可选链则会在某一个部分收到undefined或null时直接短路掉，不会再发生后面的调用
4. 作为代码提示的辅助工具
```typescript
 interface IStruct {
    foo: string;
    bar: {
      barPropA: string;
      barPropB: number;
      barMethod: () => void;
      baz: {
        handler: () => Promise<void>;
      };
    };
  }

  //   必须这样才不会报类型错误
  const obj: IStruct = {
    foo: "uu",
    bar: {
      barPropA: "oo",
      barPropB: 33,
      barMethod: () => {
        console.log(11);
      },
      baz: {
        handler: () => {
          return new Promise((resolve, reject) => {});
        },
      },
    },
  };

  //   但是使用断言之后，这样就不会报错
  const obj1 = <IStruct>{};
```
<a name="aZUKL"></a>
# ts类型工具
<a name="Zgxzq"></a>
## 工具类型
```typescript
  //   工具类型
  type Factory<T> = T | number | string;
  const foo4: Factory<boolean> = true;

  //   一般不会使用工具类型来做类型标注,而是再度声明一个新的类型别名
  type FactoryWithBool = Factory<boolean>;
  const foo5: FactoryWithBool = "ii";
```
<a name="htf82"></a>
## 联合类型与交叉类型

1. 联合类型：`|`——只要符合联合类型中的一个类型，就可以认为实现了这个联合类型
2. 交叉类型： `&`——需要符合这里的所有类型，才可以说实现了这个交叉类型
- 对于对象类型的交叉类型，其内部的同名属性同样会按照交叉类型进行合并
```typescript
type Struct1 = {
  primitiveProp: string;
  objectProp: {
    name: string;
  }
}

type Struct2 = {
  primitiveProp: number;
  objectProp: {
    age: number;
  }
}

type Composed = Struct1 & Struct2;

type PrimitivePropType = Composed['primitiveProp']; // never
type ObjectPropType = Composed['objectProp']; // { name: string; age: number; }
```

- 对于多个联合类型组成的交叉类型，实现这个类型也就是多个联合类型的交集
<a name="XmfkJ"></a>
## 索引类型

- 索引类型包含三个部分，分别是索引签名类型、索引类型查询与索引类型访问。但是这三者都是独立的类型工具
- 它们都通过索引的形式来进行类型操作，但索引签名类型是声明，后两者则是读取
<a name="aLDle"></a>
### 索引类型签名

1. 主要指的是在接口或者类型别名中，通过以下语法来快速声明一个键值类型一致的类型结构
```typescript
  interface AllStringTypes {
    [key: string]: string;
  }

  type AllStringType = {
    [key: string]: string;
  };

  type PropType = AllStringType["wujiayu"]; // string
```

- 注意的是：由于js会将数字索引访问转换为字符串索引访问，即：obj[599]与obj['599']的效果是一致的
2. 索引签名类型也可以和具体的键值对类型声明并存，但是这些具体的键值类型也需要符合索引签名类型的声明
```typescript
  interface AllStringTypeType {
    prop: number; // 报错：类型number的属性prop不能赋给string索引类型string | boolean
    [key: string]: string | boolean;
    propa: "ii";
    propb: true;
  }

```
<a name="OPyZ5"></a>
### 索引类型查询

1. 也就是keyof操作符。它可以将对象中所有的键转换为对应字面量类型，然后再组成联合类型；但是这里并不会将数字类型的键名转换为字符串类型字面量，而是仍然保持为数字类型字面量
```typescript
  interface Foo {
    wujiayu: 1;
    599: 2;
  }
  type Fookey = keyof Foo; // 'wujiayu' | 599
```
<a name="szFLr"></a>
### 索引类型访问

1. 在这里使用string这个类型来访问NUmberRecord.其访问方式与返回值均是类型
```typescript
  interface NumberRecord {
    [key: string]: number;
  }
  type PropTyp = NumberRecord[string]; // number
```

2.  一次性获取对象所有键的字面量类型
```typescript
  interface FOOFOO {
    props: number;
    propsa: string;
    propb: boolean;
  }
  type PropUnion = FOOFOO[keyof FOOFOO]; // string | number |boolean
```
<a name="Y4zZZ"></a>
## 映射类型

- 基于键名映射到键值类型
```typescript
  type Stringfy<T> = {
    [k in keyof T]: string;
  };
```
上面的工具类型会接受一个对象类型，通过映射类型(in 关键字)将keyof生成的联合类型的每一个成员映射出来，并将其键值设置为string
```typescript


  // 当然，我们也可以拿到键值类型: T[k]
  type clone<T> = {
    [k in keyof T]: T[k];
  };
```

<a name="dezsf"></a>
# ts类型工具：类型安全保障
<a name="ghlp3"></a>
## typeof

1. 除了检查变量类型的typeof，ts还新增了用于类型查询的typeof，返回的是一个ts类型
```typescript
const str = "linbudu";

const obj = { name: "linbudu" };

const nullVar = null;
const undefinedVar = undefined;

const func = (input: string) => {
  return input.length > 10;
}

type Str = typeof str; // "linbudu"
type Obj = typeof obj; // { name: string; }
type Null = typeof nullVar; // null
type Undefined = typeof undefined; // undefined
type Func = typeof func; // (input: string) => boolean
```
绝大部分情况下，typeof返回的类型就是你把鼠标悬浮爱变量名时出现的推导后的类型，并且类型查询操作符后是不允许使用表达式的
<a name="RlQ3t"></a>
## 类型守卫
<a name="lmsRT"></a>
### is
```typescript
function isString(input: unknown): boolean {
  return typeof input === "string";
}

function foo(input: string | number) {
  if (isString(input)) {
    // 报错：类型“string | number”上不存在属性“replace”。
    (input).replace("linbudu", "linbudu599")
  }
  if (typeof input === 'number') { }
  // ...
}
```
由于isString封装的函数在外侧，ts的类型控制流做不到跨越函数上下文进行类型的信息收集，所以我们需要使用is关键字来显示地提供类型信息
```typescript
function isString(input: unknown): input is string {
  return typeof input === "string";
}

function foo(input: string | number) {
  if (isString(input)) {
    // 正确了
    (input).replace("linbudu", "linbudu599")
  }
  if (typeof input === 'number') { }
  // ...
}
```
但是需要注意的是，类型守卫函数并不会对判断逻辑和实际类型的关联进行检查
```typescript
function isString(input: unknown): input is number {
  return typeof input === "string";
}

function foo(input: string | number) {
  if (isString(input)) {
    // 报错，在这里变成了 number 类型
    (input).replace("linbudu", "linbudu599")
  }
  if (typeof input === 'number') { }
  // ...
}
```
<a name="G9Xo2"></a>
## 基于in与instanceof的类型保护

1. 可以通过`key in object`的方式来判断key是否存在于object
```typescript
interface Foo {
  foo: string;
  fooOnly: boolean;
  shared: number;
}

interface Bar {
  bar: string;
  barOnly: boolean;
  shared: number;
}

function handle(input: Foo | Bar) {
  if ('foo' in input) {
    input.fooOnly;
  } else {
    input.barOnly;
  }
}
```

2. 也可以是共同属性的自变量类型差异
```typescript
function ensureArray(input: number | number[]): number[] {
  if (Array.isArray(input)) {
    return input;
  } else {
    return [input];
  }
}

interface Foo {
  kind: 'foo';
  diffType: string;
  fooOnly: boolean;
  shared: number;
}

interface Bar {
  kind: 'bar';
  diffType: number;
  barOnly: boolean;
  shared: number;
}

function handle1(input: Foo | Bar) {
  if (input.kind === 'foo') {
    input.fooOnly;
  } else {
    input.barOnly;
  }
}
```
但是需要注意的是：对于同名但不同类型的属性，我们需要使用字面量类型的区分，并不能简单地使用typeof
```typescript
function handle2(input: Foo | Bar) {
  // 报错，并没有起到区分的作用，在两个代码块中都是 Foo | Bar
  if (typeof input.diffType === 'string') {
    input.fooOnly;
  } else {
    input.barOnly;
  }
}
```

3. instanceof判断的是原型级别的关系.如`foo instaneof Base`会沿着foo的原型链查找`Base.prototype`是否存在其上
```typescript
class FooBase {}

class BarBase {}

class Foo extends FooBase {
  fooOnly() {}
}
class Bar extends BarBase {
  barOnly() {}
}

function handle(input: Foo | Bar) {
  if (input instanceof FooBase) {
    input.fooOnly();
  } else {
    input.barOnly();
  }
}
```
<a name="tSfL2"></a>
## 类型断言守卫：使用asserts关键字

- 在判断不通过时，断言守卫需要抛出一个错误，类型守卫只需要剔除掉预期的类型
- 举例来说，对于` assert(typeof name === 'number');` 这么一个断言，如果函数成功返回，就说明其后续的代码中 condition 均成立，也就是 name 神奇地变成了一个 number 类型。
- 还可以结合使用 is 关键字来提供进一步的类型守卫能力
```typescript
let name: any = 'linbudu';

function assertIsNumber(val: any): asserts val is number {
  if (typeof val !== 'number') {
    throw new Error('Not a number!');
  }
}

assertIsNumber(name);

// number 类型！
name.toFixed();
```
<a name="KKhKQ"></a>
# 泛型

- 大多用来进行工具类型封装
```typescript
type Stringify<T> = {
  [K in keyof T]: string;
};

type Clone<T> = {
  [K in keyof T]: T[K];
};
```
Stringify 会将一个对象类型的所有属性类型置为 string ，而 Clone 则会进行类型的完全复制
<a name="TS3O8"></a>
## 条件类型

- 在条件类型的参与下，通常泛型会被作为条件类型中的判断条件以及返回值(即 ：两端的值)，如：
```typescript
type IsEqual<T> = T extends true ? 1 : 2;
type A = IsEqual<true>; // 1
type B = IsEqual<false>; // 2
type C = IsEqual<'linbudu'>; // 2
```
<a name="X1gHA"></a>
## 泛型约束与默认值
```typescript
// 声明
type Factory<T = boolean> = T | number | string;

// 调用的时候就不用携带参数了
const foo: Factory = false;
```
<a name="oFxNo"></a>
### 泛型约束

- 要求传入这个工具类型的泛型必须符合某些条件，否则就拒绝进行后面的逻辑
- 使用extends关键字来进行约束
```typescript
type ResStatus<ResCode extends number> = ResCode extends 10000 | 10001 | 10002
  ? 'success'
  : 'failure';


type Res1 = ResStatus<10000>; // "success"
type Res2 = ResStatus<20000>; // "failure"

type Res3 = ResStatus<'10000'>; // 类型“string”不满足约束“number”。
```
<a name="lslri"></a>
## 多泛型关联

- 不仅可以同时传入多个泛型参数，还可以让这几个泛型参数之间也存在联系
```typescript
type Conditional<Type, Condition, TruthyResult, FalsyResult> =
  Type extends Condition ? TruthyResult : FalsyResult;
```
<a name="feUFv"></a>
## 对象类型中的泛型
```typescript
interface IRes<TData = unknown> {
  code: number;
  error: string;
  data: TData;
}
interface IUserProfileRes {
  name: string;
  homepage: string;
  avatar: string;
}

function fetchUserProfile(): Promise<IRes<IUserProfileRes>> {}

type StatusSucceed = boolean;
function handleOperation(): Promise<IRes<StatusSucceed>> {}
```
<a name="v44ra"></a>
## 函数中的泛型
```typescript
function handle<T>(input: T): T{}
```
<a name="pusiq"></a>
## class中的泛型
```typescript
class Queue<TElementType> {
  private _list: TElementType[];
}
```
<a name="FSY8E"></a>
# 结构化类型系统
<a name="ZZasf"></a>
## 结构化类型系统

- 当两个对象的属性方法完全一致时，即使名字不一样，也会被认为是一致的
- 当前面的类型添加独特的方法之后，后面的类型与前面的类型就不能认为是一致的了
- 当后面的类型添加独特的方法时，也会被认为是一致的，结构化类型系统会认为后面的类型完全实现了前面的类型，至于独特的方法，则被认为是后者继承前者类型后添加的新方法
<a name="ESMq5"></a>
## 标称类型系统

- 要求类型名称必须是完全一致的
<a name="tzqF2"></a>
### 在ts中模拟标称类型系统

- 通过交叉类型的方式来实现信息的附加
```typescript
export declare class TagProtector<T extends string> {
  protected __tag__: T;
}

export type Nominal<T, U extends string> = T & TagProtector<U>; // 使用Nominal来携带额外的信息，并和原本的类型合并到一起
```

- 从逻辑层面确保安全性
```typescript
class CNY {
  private __tag!: void;
  constructor(public value: number) {}
}
class USD {
  private __tag!: void;
  constructor(public value: number) {}
}
```
<a name="QWCXW"></a>
# 类型层级
```typescript
type VerboseTypeChain = never extends 'linbudu'
  ? 'linbudu' extends 'linbudu' | 'budulin'
  ? 'linbudu' | 'budulin' extends string
  ? string extends {}
  ? string extends String
  ? String extends {}
  ? {} extends object
  ? object extends {}
  ? {} extends Object
  ? Object extends {}
  ? object extends Object
  ? Object extends object
  ? Object extends any
  ? Object extends unknown
  ? any extends unknown
  ? unknown extends any
  ? 8
  : 7
  : 6
  : 5
  : 4
  : 3
  : 2
  : 1
  : 0
  : -1
  : -2
  : -3
  : -4
  : -5
  : -6
  : -7
  : -8
```
![[9{{JSXW}0`}JZ8SVH~%LB7.png](https://cdn.nlark.com/yuque/0/2023/png/29733541/1680009877894-6259fccf-ec31-4c32-aaa6-d3538c832593.png#averageHue=%233e90ae&clientId=ue3ffda21-0fac-4&from=paste&height=680&id=udc9fa1d8&originHeight=680&originWidth=1096&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=323887&status=done&style=none&taskId=udc5452c1-8ce6-43d8-9324-206ddba7484&title=&width=1096)
<a name="dv5Dx"></a>
# 条件类型与infer

1. 使用嵌套的条件类型进行字面量类型到基础类型地提取
```typescript
  function uni<T extends number | bigint | string>(x: T, y: T): Liter<T> {
    return x + (y as any);
  }

  export type Liter<T> = T extends number
    ? number
    : T extends bigint
    ? bigint
    : T extends string
    ? string
    : never;
```

2. infer关键字
- ts支持通过infer关键字来在条件类型中提取类型的某一部分信息，如下：提取函数返回值类型
```typescript
type Func = (...args: any[]) => any;
type FuncReturn<T extends Func> = T extends (...args: any[]) => infer R ? R :never
```
上面代码的意思就是：当传入的类型参数满足`T extends (...args: any[]) => infer R`这样一个结构(不用管)
