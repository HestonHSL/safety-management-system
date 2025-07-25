---
title: 校园管理(新)
language_tabs:
  - shell: Shell
  - http: HTTP
  - javascript: JavaScript
  - ruby: Ruby
  - python: Python
  - php: PHP
  - java: Java
  - go: Go
toc_footers: []
includes: []
search: true
code_clipboard: true
highlight_theme: darkula
headingLevel: 2
generator: "@tarslib/widdershins v4.0.30"

---

# 校园管理(新)

Base URLs:

# Authentication

# Default

## GET 文件下载

GET /common/download

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|fileName|query|string| 是 |文件名|
|delete|query|boolean| 是 |是否删除|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 用户登录

POST /login

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|username|query|string| 否 |none|
|password|query|string| 否 |none|
|rememberMe|query|boolean| 否 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

# 部门信息管理

<a id="opIdgetChildrenUsingGET_1"></a>

## GET 根据父部门ID查询子部门列表

GET /children/{parentId}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|parentId|path|integer(int64)| 是 |parentId|

> 返回示例

> 200 Response

```
{"property1":{},"property2":{}}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Not Found|None|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» **additionalProperties**|object|false|none||none|

<a id="opIdgetPointCountUsingGET"></a>

## GET 获取部门点位数量统计

GET /pointCount/{deptId}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|deptId|path|integer(int64)| 是 |部门ID|

> 返回示例

> 200 Response

```
{"property1":{},"property2":{}}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Not Found|None|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» **additionalProperties**|object|false|none||none|

<a id="opIdtreeUsingGET_1"></a>

## GET 查询部门树形结构列表

GET /tree

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|deptCode|query|string| 否 |部门编码|
|deptId|query|integer(int64)| 否 |部门ID|
|deptName|query|string| 否 |部门名称|
|parentId|query|integer(int64)| 否 |上级部门ID|

> 返回示例

> 200 Response

```
{"property1":{},"property2":{}}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Not Found|None|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» **additionalProperties**|object|false|none||none|

<a id="opIdgetByIdUsingGET_1"></a>

## GET 查询部门信息

GET /{deptId}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|deptId|path|integer(int64)| 是 |部门ID|

> 返回示例

> 200 Response

```
{"property1":{},"property2":{}}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Not Found|None|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» **additionalProperties**|object|false|none||none|

<a id="opIdremoveUsingDELETE_1"></a>

## DELETE 删除部门信息

DELETE /campus/department/{ids}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|ids|path|string| 是 |部门id以,分割|

> 返回示例

> 200 Response

```
{"property1":{},"property2":{}}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|No Content|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden|None|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» **additionalProperties**|object|false|none||none|

# 巡查点位信息管理

<a id="opIdbatchDownloadQrCodeUsingPOST"></a>

## POST 批量下载二维码

POST /campus/point/batchDownloadQrCode

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|building|query|string| 否 |楼栋|
|deptId|query|integer(int64)| 否 |部门ID|
|detailName|query|string| 否 |详细名称|
|floor|query|string| 否 |楼层|
|guardId|query|integer(int64)| 否 |安全员ID|
|pointCode|query|string| 否 |点位编码|
|pointId|query|integer(int64)| 否 |点位ID|
|purpose|query|string| 否 |用途|
|roomNumber|query|string| 否 |房间号|

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|None|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Created|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Not Found|None|

<a id="opIdcheckPointCodeUniqueUsingGET"></a>

## GET 校验点位编码唯一性

GET /checkPointCodeUnique

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|pointCode|query|string| 是 |点位编码|

> 返回示例

> 200 Response

```
{"property1":{},"property2":{}}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Not Found|None|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» **additionalProperties**|object|false|none||none|

<a id="opIdgetByQrCodeUsingGET"></a>

## GET 根据二维码code查询点位信息

GET /getByQrCode

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|qrCode|query|string| 否 |点位ID|

> 返回示例

> 200 Response

```
{"property1":{},"property2":{}}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Not Found|None|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» **additionalProperties**|object|false|none||none|

<a id="opIdgetQrCodeBase64UsingGET"></a>

## GET 获取点位二维码base64

GET /qrCodeBase64/{pointId}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|pointId|path|integer(int64)| 是 |点位ID|

> 返回示例

> 200 Response

```
{"property1":{},"property2":{}}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Not Found|None|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» **additionalProperties**|object|false|none||none|

<a id="opIdgetQrCodeUsingGET"></a>

## GET 获取巡查点位二维码

GET /qrcode/{pointId}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|pointId|path|integer(int64)| 是 |点位ID|

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Not Found|None|

<a id="opIdeditUsingGET"></a>

## GET 查询巡查点位信息

GET /{pointId}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|pointId|path|integer(int64)| 是 |点位ID|

> 返回示例

> 200 Response

```
{"property1":{},"property2":{}}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Not Found|None|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» **additionalProperties**|object|false|none||none|

<a id="opIdbindGuardUsingPOST"></a>

## POST 绑定安全员到巡查点位

POST /bind/{pointId}/{guardId}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|pointId|path|integer(int64)| 是 |点位ID|
|guardId|path|integer(int64)| 是 |安全员ID|

> 返回示例

> 200 Response

```
{"property1":{},"property2":{}}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Created|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Not Found|None|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» **additionalProperties**|object|false|none||none|

<a id="opIdunbindGuardUsingPOST"></a>

## POST 解绑巡查点位的安全员

POST /unbind/{pointId}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|pointId|path|integer(int64)| 是 |点位ID|

> 返回示例

> 200 Response

```
{"property1":{},"property2":{}}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Created|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Not Found|None|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» **additionalProperties**|object|false|none||none|

# 安全员信息管理

<a id="opIdeditSaveUsingPUT_3"></a>

## PUT 修改保存安全员信息

PUT /

> Body 请求参数

```json
{
  "deptId": 0,
  "guardId": 0,
  "name": "string",
  "officePhone": "string",
  "phoneNumber": "string",
  "wechatId": "string",
  "remark": "string"
}
```

### 请求参数

|名称|位置|类型|必选|中文名|说明|
|---|---|---|---|---|---|
|body|body|object| 否 ||none|
|» deptId|body|integer(int64)| 是 | 部门ID|none|
|» guardId|body|integer(int64)| 是 | 安全员ID|none|
|» name|body|string| 否 | 安全员名称|none|
|» officePhone|body|string| 否 | 办公室电话|none|
|» phoneNumber|body|string| 否 | 手机|none|
|» wechatId|body|string| 否 | 微信号|none|
|» remark|body|string| 否 | 备注|none|

> 返回示例

> 200 Response

```
{"property1":{},"property2":{}}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Created|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Not Found|None|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» **additionalProperties**|object|false|none||none|

<a id="opIdaddSaveUsingPOST_3"></a>

## POST 新增保存安全员信息

POST /

> Body 请求参数

```json
{
  "deptId": 0,
  "name": "string",
  "officePhone": "string",
  "phoneNumber": "string",
  "wechatId": "string",
  "remark": "string"
}
```

### 请求参数

|名称|位置|类型|必选|中文名|说明|
|---|---|---|---|---|---|
|body|body|object| 否 ||none|
|» deptId|body|integer(int64)| 是 | 部门ID|none|
|» name|body|string| 否 | 安全员名称|none|
|» officePhone|body|string| 否 | 办公室电话|none|
|» phoneNumber|body|string| 否 | 手机|none|
|» wechatId|body|string| 否 | 微信号|none|
|» remark|body|string| 否 | 备注|none|

> 返回示例

> 200 Response

```
{"property1":{},"property2":{}}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Created|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Not Found|None|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» **additionalProperties**|object|false|none||none|

<a id="opIdexportUsingPOST_3"></a>

## POST 导出安全员信息列表

POST /export

### 请求参数

|名称|位置|类型|必选|中文名|说明|
|---|---|---|---|---|---|
|deptId|query|integer(int64)| 否 ||部门ID|
|guardId|query|integer(int64)| 否 ||安全员ID|
|name|query|string| 否 ||安全员名称|
|officePhone|query|string| 否 ||办公室电话|
|phoneNumber|query|string| 否 ||手机|
|wechatId|query|string| 否 ||微信号|

> 返回示例

> 200 Response

```
{"property1":{},"property2":{}}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Created|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Not Found|None|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» **additionalProperties**|object|false|none||none|

<a id="opIdlistUsingGET_3"></a>

## GET 查询安全员信息列表

GET /list

### 请求参数

|名称|位置|类型|必选|中文名|说明|
|---|---|---|---|---|---|
|deptId|query|integer(int64)| 否 ||部门ID|
|guardId|query|integer(int64)| 否 ||安全员ID|
|name|query|string| 否 ||安全员名称|
|officePhone|query|string| 否 ||办公室电话|
|phoneNumber|query|string| 否 ||手机号|
|wechatId|query|string| 否 ||微信号|
|pageNum|query|integer| 否 ||当前页数|
|pageSize|query|integer| 否 ||每页记录数|
|orderByColumn|query|string| 否 ||排序字段|
|isAsc|query|string| 否 ||none|

> 返回示例

> 200 Response

```
{"code":0,"msg":"string","rows":[{}],"total":0}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[TableDataInfo](#schematabledatainfo)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Not Found|None|

<a id="opIdimportDataUsingPOST_1"></a>

## POST 导入安全员信息

POST /importData

> Body 请求参数

```yaml
updateSupport: ""
file: ""

```

### 请求参数

|名称|位置|类型|必选|中文名|说明|
|---|---|---|---|---|---|
|body|body|object| 否 ||none|
|» updateSupport|body|boolean| 是 ||是否支持更新|
|» file|body|string(binary)| 是 ||excel|

> 返回示例

> 200 Response

```
{"property1":{},"property2":{}}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Created|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Not Found|None|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» **additionalProperties**|object|false|none||none|

<a id="opIdimportTemplateUsingPOST_1"></a>

## POST 下载安全员导入模板

POST /importTemplate

> 返回示例

> 200 Response

```
{"property1":{},"property2":{}}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Created|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Not Found|None|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» **additionalProperties**|object|false|none||none|

<a id="opIdremoveUsingDELETE_3"></a>

## DELETE 删除安全员信息

DELETE /{ids}

### 请求参数

|名称|位置|类型|必选|中文名|说明|
|---|---|---|---|---|---|
|ids|path|string| 是 ||安全员ID,拼接|

> 返回示例

> 200 Response

```
{"property1":{},"property2":{}}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|No Content|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden|None|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» **additionalProperties**|object|false|none||none|

<a id="opIdbindableListUsingGET"></a>

## GET 获取可绑定的安全员列表(不带分页)

GET /bindableList

> 返回示例

> 200 Response

```
{"property1":{},"property2":{}}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Not Found|None|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» **additionalProperties**|object|false|none||none|

<a id="opIdgetPatrolPointsByGuardIdUsingGET"></a>

## GET 根据安全员ID查询绑定的点位列表

GET /points/{guardId}

### 请求参数

|名称|位置|类型|必选|中文名|说明|
|---|---|---|---|---|---|
|guardId|path|integer(int64)| 是 ||安全员ID|

> 返回示例

> 200 Response

```
{"property1":{},"property2":{}}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Not Found|None|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» **additionalProperties**|object|false|none||none|

<a id="opIdgetUsingGET"></a>

## GET 获取安全员信息

GET /{guardId}

### 请求参数

|名称|位置|类型|必选|中文名|说明|
|---|---|---|---|---|---|
|guardId|path|integer(int64)| 是 ||安全员ID|

> 返回示例

> 200 Response

```
{"property1":{},"property2":{}}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Not Found|None|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» **additionalProperties**|object|false|none||none|

# 数据模型

<h2 id="tocS_Department">Department</h2>

<a id="schemadepartment"></a>
<a id="schema_Department"></a>
<a id="tocSdepartment"></a>
<a id="tocsdepartment"></a>

```json
{
  "ancestors": "string",
  "children": [
    {
      "ancestors": "string",
      "children": [
        {
          "ancestors": "string",
          "children": [
            {}
          ],
          "createBy": "string",
          "createTime": "2019-08-24T14:15:22Z",
          "delFlag": "string",
          "deptCode": "string",
          "deptId": 0,
          "deptName": "string",
          "orderNum": 0,
          "params": {},
          "parentId": 0,
          "parentName": "string",
          "pointCount": 0,
          "remark": "string",
          "status": "string",
          "updateBy": "string",
          "updateTime": "2019-08-24T14:15:22Z"
        }
      ],
      "createBy": "string",
      "createTime": "2019-08-24T14:15:22Z",
      "delFlag": "string",
      "deptCode": "string",
      "deptId": 0,
      "deptName": "string",
      "orderNum": 0,
      "params": {},
      "parentId": 0,
      "parentName": "string",
      "pointCount": 0,
      "remark": "string",
      "status": "string",
      "updateBy": "string",
      "updateTime": "2019-08-24T14:15:22Z"
    }
  ],
  "createBy": "string",
  "createTime": "2019-08-24T14:15:22Z",
  "delFlag": "string",
  "deptCode": "string",
  "deptId": 0,
  "deptName": "string",
  "orderNum": 0,
  "params": {},
  "parentId": 0,
  "parentName": "string",
  "pointCount": 0,
  "remark": "string",
  "status": "string",
  "updateBy": "string",
  "updateTime": "2019-08-24T14:15:22Z"
}

```

Department

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|ancestors|string|false|none||none|
|children|[[Department](#schemadepartment)]|false|none||none|
|createBy|string|false|none||none|
|createTime|string(date-time)|false|none||none|
|delFlag|string|false|none||none|
|deptCode|string|false|none||none|
|deptId|integer(int64)|false|none||none|
|deptName|string|false|none||none|
|orderNum|integer(int32)|false|none||none|
|params|object|false|none||none|
|parentId|integer(int64)|false|none||none|
|parentName|string|false|none||none|
|pointCount|integer(int32)|false|none||none|
|remark|string|false|none||none|
|status|string|false|none||none|
|updateBy|string|false|none||none|
|updateTime|string(date-time)|false|none||none|

<h2 id="tocS_PatrolPoint">PatrolPoint</h2>

<a id="schemapatrolpoint"></a>
<a id="schema_PatrolPoint"></a>
<a id="tocSpatrolpoint"></a>
<a id="tocspatrolpoint"></a>

```json
{
  "bindTime": "2019-08-24T14:15:22Z",
  "building": "string",
  "createBy": "string",
  "createTime": "2019-08-24T14:15:22Z",
  "deptId": 0,
  "deptName": "string",
  "detailName": "string",
  "floor": "string",
  "guardDept": "string",
  "guardId": 0,
  "guardName": "string",
  "guardPhone": "string",
  "params": {},
  "pointCode": "string",
  "pointId": 0,
  "purpose": "string",
  "qrCode": "string",
  "qrCodeBase64": "string",
  "remark": "string",
  "roomNumber": "string",
  "updateBy": "string",
  "updateTime": "2019-08-24T14:15:22Z"
}

```

PatrolPoint

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|bindTime|string(date-time)|false|none||none|
|building|string|false|none||none|
|createBy|string|false|none||none|
|createTime|string(date-time)|false|none||none|
|deptId|integer(int64)|false|none||none|
|deptName|string|false|none||none|
|detailName|string|false|none||none|
|floor|string|false|none||none|
|guardDept|string|false|none||none|
|guardId|integer(int64)|false|none||none|
|guardName|string|false|none||none|
|guardPhone|string|false|none||none|
|params|object|false|none||none|
|pointCode|string|false|none||none|
|pointId|integer(int64)|false|none||none|
|purpose|string|false|none||none|
|qrCode|string|false|none||none|
|qrCodeBase64|string|false|none||none|
|remark|string|false|none||none|
|roomNumber|string|false|none||none|
|updateBy|string|false|none||none|
|updateTime|string(date-time)|false|none||none|

<h2 id="tocS_R«List«UserEntity»»">R«List«UserEntity»»</h2>

<a id="schemar«list«userentity»»"></a>
<a id="schema_R«List«UserEntity»»"></a>
<a id="tocSr«list«userentity»»"></a>
<a id="tocsr«list«userentity»»"></a>

```json
{
  "code": 0,
  "data": [
    {
      "mobile": "string",
      "password": "string",
      "userId": 0,
      "username": "string"
    }
  ],
  "msg": "string"
}

```

R«List«UserEntity»»

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer(int32)|false|none||none|
|data|[[UserEntity](#schemauserentity)]|false|none||[用户实体]|
|msg|string|false|none||none|

<h2 id="tocS_R«UserEntity»">R«UserEntity»</h2>

<a id="schemar«userentity»"></a>
<a id="schema_R«UserEntity»"></a>
<a id="tocSr«userentity»"></a>
<a id="tocsr«userentity»"></a>

```json
{
  "code": 0,
  "data": {
    "mobile": "string",
    "password": "string",
    "userId": 0,
    "username": "string"
  },
  "msg": "string"
}

```

R«UserEntity»

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer(int32)|false|none||none|
|data|[UserEntity](#schemauserentity)|false|none||用户实体|
|msg|string|false|none||none|

<h2 id="tocS_R«string»">R«string»</h2>

<a id="schemar«string»"></a>
<a id="schema_R«string»"></a>
<a id="tocSr«string»"></a>
<a id="tocsr«string»"></a>

```json
{
  "code": 0,
  "data": "string",
  "msg": "string"
}

```

R«string»

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer(int32)|false|none||none|
|data|string|false|none||none|
|msg|string|false|none||none|

<h2 id="tocS_SecurityGuard">SecurityGuard</h2>

<a id="schemasecurityguard"></a>
<a id="schema_SecurityGuard"></a>
<a id="tocSsecurityguard"></a>
<a id="tocssecurityguard"></a>

```json
{
  "createBy": "string",
  "createTime": "2019-08-24T14:15:22Z",
  "deptId": 0,
  "deptName": "string",
  "guardId": 0,
  "name": "string",
  "officePhone": "string",
  "params": {},
  "phoneNumber": "string",
  "remark": "string",
  "updateBy": "string",
  "updateTime": "2019-08-24T14:15:22Z",
  "wechatId": "string"
}

```

SecurityGuard

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|createBy|string|false|none||none|
|createTime|string(date-time)|false|none||none|
|deptId|integer(int64)|false|none||none|
|deptName|string|false|none||none|
|guardId|integer(int64)|false|none||none|
|name|string|false|none||none|
|officePhone|string|false|none||none|
|params|object|false|none||none|
|phoneNumber|string|false|none||none|
|remark|string|false|none||none|
|updateBy|string|false|none||none|
|updateTime|string(date-time)|false|none||none|
|wechatId|string|false|none||none|

<h2 id="tocS_TableDataInfo">TableDataInfo</h2>

<a id="schematabledatainfo"></a>
<a id="schema_TableDataInfo"></a>
<a id="tocStabledatainfo"></a>
<a id="tocstabledatainfo"></a>

```json
{
  "code": 0,
  "msg": "string",
  "rows": [
    {}
  ],
  "total": 0
}

```

TableDataInfo

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer(int32)|false|none||none|
|msg|string|false|none||none|
|rows|[object]|false|none||none|
|total|integer(int64)|false|none||none|

<h2 id="tocS_UserEntity">UserEntity</h2>

<a id="schemauserentity"></a>
<a id="schema_UserEntity"></a>
<a id="tocSuserentity"></a>
<a id="tocsuserentity"></a>

```json
{
  "mobile": "string",
  "password": "string",
  "userId": 0,
  "username": "string"
}

```

UserEntity

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|mobile|string|false|none||用户手机|
|password|string|false|none||用户密码|
|userId|integer(int32)|false|none||用户ID|
|username|string|false|none||用户名称|

