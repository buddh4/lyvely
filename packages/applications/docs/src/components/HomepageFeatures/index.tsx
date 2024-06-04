import clsx from 'clsx';
import styles from './styles.module.css';
import React, { useState } from 'react';

type FeatureItem = {
  title: string;
  svgPaths: string[],
  svgViewBox: string,
  description: JSX.Element;
};

const DevFeatureList: FeatureItem[] = [
  {
    title: 'Modules',
    svgViewBox: '0 0 24 24',
    svgPaths: [
      "M9 2h-5c-1.103 0-2 0.896-2 2v5c0 1.104 0.897 2 2 2h5c1.103 0 2-0.896 2-2v-5c0-1.104-0.897-2-2-2zM9 9h-5v-5h5v5z",
      "M20 2h-5c-1.104 0-2 0.896-2 2v5c0 1.104 0.896 2 2 2h5c1.104 0 2-0.896 2-2v-5c0-1.104-0.896-2-2-2zM20 9h-5v-5h5v5z",
      "M9 13h-5c-1.103 0-2 0.896-2 2v5c0 1.104 0.897 2 2 2h5c1.103 0 2-0.896 2-2v-5c0-1.104-0.897-2-2-2zM9 20h-5v-5h5v5z",
      "M20 13h-5c-1.104 0-2 0.896-2 2v5c0 1.104 0.896 2 2 2h5c1.104 0 2-0.896 2-2v-5c0-1.104-0.896-2-2-2zM20 20h-5v-5h5v5z"
    ],
    description: (
      <>
        Create your own custom modules and leverage Lyvely's extensive APIs tailored for implementing state of the art
        self-improvement and collaboration platforms. Utilize type-safe interfaces to ensure consistency and share
        validation and domain logic between your frontend and backend.
      </>
    ),
  },
  {
    title: 'Permissions',
    svgViewBox: '0 0 20 20',
    svgPaths: [
      'M4 8v-2c0-3.314 2.686-6 6-6s6 2.686 6 6v0 2h1c1.105 0 2 0.895 2 2v0 8c0 1.105-0.895 2-2 2v0h-14c-1.105 0-2-0.895-2-2v0-8c0-1.1 0.9-2 2-2h1zM9 14.73v2.27h2v-2.27c0.602-0.352 1-0.996 1-1.732 0-1.105-0.895-2-2-2s-2 0.895-2 2c0 0.736 0.398 1.38 0.991 1.727l0.009 0.005zM7 6v2h6v-2c0-1.657-1.343-3-3-3s-3 1.343-3 3v0z'
    ],
    description: (
      <>
        Permissions manage access to specific platform features. Lyvely's Permission API enables the creation of global,
        profile, and content-level permissions, as well as visibility rules, seamlessly integrated into both the frontend
        and backend Access Control Layer (ACL).
      </>
    ),
  },
  {
    title: 'Policies',
    svgViewBox: '0 0 20 20',
    svgPaths: [
      'M19 11c-0.142 2.503-1.491 4.664-3.47 5.922l-0.030 0.018-5.5 3.060-5.5-3.060c-2.009-1.276-3.358-3.437-3.499-5.92l-0.001-0.020v-8c3.38 0 6.5-1.12 9-3 2.5 1.89 5.62 3 9 3v8zM10 12.080l2.92 2.040-1.030-3.41 2.84-2.15-3.56-0.080-1.17-3.36-1.17 3.36-3.56 0.080 2.83 2.14-1.030 3.4 2.93-2.010z'
    ],
    description: (
      <>
        Use the Policy API to create complex and configurable rules for the Lyvely platform. With policies, you can
        implement diverse strategies for various features, which can be overridden by configuration. The Policy API is
        designed to enhance the platform's flexibility.
      </>
    ),
  },
  {
    title: 'Content',
    svgViewBox: '0 0 20 20',
    svgPaths: [
      'M10 15l-4 4v-4h-4c-1.105 0-2-0.895-2-2v0-10c0-1.1 0.9-2 2-2h16c1.105 0 2 0.895 2 2v0 10c0 1.105-0.895 2-2 2v0h-8zM5 7v2h2v-2h-2zM9 7v2h2v-2h-2zM13 7v2h2v-2h-2z'
    ],
    description: (
      <>
        The Lyvely platform is powered by a sophisticated Content API, enabling seamless integration of various types
        of content. The flexible content schema includes configuration, state, metadata, and content data, along
        with a comprehensive approach to visibility and read, write, and manage policies.
      </>
    ),
  },
  {
    title: 'Features',
    svgViewBox: '0 0 32 32',
    svgPaths: [
      'M22 2l-10 10h-6l-6 8c0 0 6.357-1.77 10.065-0.94l-10.065 12.94 13.184-10.255c1.839 4.208-1.184 10.255-1.184 10.255l8-6v-6l10-10 2-10-10 2z'
    ],
    description: (
      <>
        The Feature API enables the creation of feature switches to activate or deactivate certain platform features and thus enables
        the implementation of a highly flexible platform. Feature switches are seamlessly integrated into the access layer of the
        frontend and backend.
      </>
    ),
  },
  {
    title: 'I18n',
    svgViewBox: '0 0 32 32',
    svgPaths: [
      "M16 32c-8.836 0-16-7.164-16-16s7.164-16 16-16c8.836 0 16 7.164 16 16s-7.164 16-16 16zM28.968 14.659c0.026-0.013 0.040-0.035 0.050-0.070 0.021 0.111 0.072 0.209 0.154 0.281 0.002 0.010-0.003 0.008 0.002 0.022 0.008 0 0.014-0.006 0.021-0.006 0.084 0.068 0.188 0.114 0.305 0.114 0.18 0 0.33-0.1 0.418-0.241 0.006 0.007 0.016 0.016 0.021 0.024-0.001-0.016-0.003-0.032-0.005-0.048 0.039-0.071 0.066-0.149 0.066-0.235 0-0.276-0.225-0.5-0.5-0.5-0.176 0-0.322 0.096-0.412 0.232-0.004-0.003 0-0.015-0.011-0.011 0.013-0.038-0.022-0.135-0.077-0.239v0.518c0 0.057-0.016 0.108-0.032 0.159zM5.992 14.509c0-0.151-0.344-0.408-0.433-0.408 0-0.027-0.14-0.335-0.193-0.335 0-0.104-0.365-0.571-0.423-0.367-0.038 0.132 0.279 0.31 0.279 0.463 0.059 0 0.307 0.47 0.356 0.552 0.542 0.916-0.405 0.29-0.405-0.098-0.121-0.060-0.312-0.521-0.312-0.647-0.071-0.057-0.281-0.502-0.264-0.502 0-0.292-0.161-0.432-0.481-0.432-0.015-0.029-0.284-0.407-0.289-0.407 0-0.12-0.216-0.492-0.336-0.551 0-0.249-0.128-0.556-0.071-0.814 0-0.271-0.014-0.578-0.106-0.856-0.835 1.793-1.314 3.785-1.314 5.893 0 6.041 3.834 11.174 9.196 13.137 0.006-0.496 0.043-1.090 0.156-1.090 0-0.074 0.063-0.384 0.12-0.384 0-0.19 0.023-0.419 0-0.647-0.071-0.143 0.094-0.326 0.144-0.551 0.277-0.139 0.081-1.533 0.29-1.533 0-0.697 0.156-1.103 0.047-1.749 0.053 0-0.315-0.391-0.312-0.384-0.353 0-0.6-0.566-0.6-0.814-0.034-0.109-0.121-0.272-0.121-0.407 0.081 0-0.505-0.856-0.505-0.839-0.31-0.172 0.017-0.412 0.048-0.694-0.269-0.089 0.003-0.815 0.12-0.815 0.012-0.092 0.060-0.155 0.145-0.191 0.060 0.239 0.339-0.119 0.12-0.119 0-0.158-0.018-0.496 0-0.575 0-0.244-0.216-0.722-0.384-0.216-0.18-0.089-0.634-0.073-0.673-0.359 0.028-0.141-0.259-0.429-0.36-0.479 0.094-0.246-0.487-0.575-0.697-0.575 0-0.053-0.111-0.029-0.144-0.096-0.214 0-0.263-0.288-0.505-0.288-0.279 0-0.56-0.191-0.817-0.191-0.086-0.171-0.485-0.104-0.577-0.288-0.209 0-0.291-0.396-0.297-0.542-0.009-0.18-0.152-0.802-0.402-0.802zM26.248 6.484c-0.002 0.006 0.002 0.002-0.008 0.022 0.015 0 0.033 0.017 0.050 0.024-0.015-0.015-0.028-0.030-0.042-0.046zM26.549 6.815c0.035 0.068 0.061 0.131 0.053 0.17 0.035 0.001 0.052-0.018 0.080-0.025-0.043-0.049-0.090-0.095-0.133-0.145zM27.418 11.371c0.016-0.432-0.36-0.36-0.479-0.6-0.124 0-0.169-0.096-0.337-0.096-0.109-0.037-0.195-0.011-0.258 0.078-0.257 0.098-0.102-0.125-0.295-0.125 0.009-0.247-0.089-0.315-0.361-0.288-0.156 0.352-0.396 0.563-0.36 0.959 0.115 0.026 0.095 0.052 0.072 0.167 0.153 0.008 1.081-0.048 1.081-0.144 0.032 0 0.193 0.331 0.193 0.048 0.129 0 0.197 0.303 0.505 0.215 0 0.062 0.514-0.214 0.239-0.214zM27.467 16.474c0.018-0.088-0.044-0.127-0.096-0.216 0.137 0-0.433-1.057-0.433-1.222-0.087-0.043-0.198-0.345-0.218-0.455-0.117-0.078-0.238-0.334-0.288-0.479-0.119-0.079-0.409-0.433-0.456-0.599 0.172 0.019 0.432 0.054 0.432-0.168-0.116 0-0.133-0.143-0.023-0.143-0.036-0.147 0.078-0.253 0.103-0.368 0.030-0.139 0.089-0.353 0.089-0.519-0.165 0-0.205 0.028-0.336 0.072 0 0.097-0.293-0.024-0.336-0.024-0.063-0.126-0.52 0.164-0.648-0.096-0.207-0.187-0.151-0.331-0.218-0.595-0.034-0.134-0.217-0.142-0.328-0.164-0.313-0.061-0.087 0.373-0.104 0.472 0.192 0-0.121 0.238-0.121 0.359-0.324-0.070-0.216-0.431-0.407-0.527-0.057-0.096-0.012-0.168-0.145-0.168 0-0.128 0.068-0.36-0.072-0.407 0-0.062-0.272-0.087-0.312-0.168-0.172 0-0.572-0.65-0.695-0.431-0.077 0.14 0.065 0.174 0.094 0.288 0.249-0.049 0.225 0.41 0.529 0.359 0 0.064 0.008 0.129 0.023 0.192 0.225-0.053 0.199 0.167 0.312 0.167-0.082 0.109-0.342-0.174-0.271 0.064 0.041 0.138 0.018 0.256-0.161 0.391 0-0.149-0.012-0.551-0.168-0.551-0.106-0.212-0.421-0.161-0.554-0.359-0.108 0-0.15-0.336-0.336-0.359-0.035 0.049-0.166 0.096-0.217 0.096-0.101 0.203-0.672 0.021-0.672 0.048-0.009 0.002-0.32 0.762-0.338 0.862-0.035 0.215-0.208 0.219-0.26 0.423-0.026 0.102-0.653 0.054-0.653 0.129-0.271-0.090-0.505-0.28-0.505-0.575-0.022 0 0.051-0.753 0.097-0.863 0.055 0.015 0.066 0.034 0.097 0.096 0.166-0.062 0.553 0.041 0.553-0.144 0.161 0.004 0.209 0.068 0.144 0.192 0.15 0.028 0.409 0.066 0.409-0.144-0.088 0-0.097-0.008-0.097-0.096 0.288-0.299-0.216-0.569-0.216-0.718-0.102-0.034-0.31-0.255-0.162-0.172 0.125 0.069 0.582 0.212 0.402-0.092 0.012-0.004 0.020-0.012 0.023-0.023 0.051 0.036 0.266 0.257 0.266 0.048 0.059 0 0.287-0.144 0.096-0.144 0.018-0.108 0.014-0.198 0.023-0.264 0.305 0.164 0.135-0.112 0.289-0.215 0 0.199 0.164-0.096 0.264-0.096 0.119-0.177 0.391-0.040 0.457-0.24-0.147-0.048-0.12-0.416-0.12-0.55 0.177 0.029 0.374-0.239 0.401-0.055 0.010 0.071 0.019 0.267 0.055 0.294 0.263 0.138 0.193-0.079 0.193-0.215-0.088 0-0.205-0.308-0.217-0.456-0.072 0.010-0.188 0.040-0.217 0.095-0.262 0-0.44-0.095-0.648-0.095-0.016-0.032-0.266-0.312-0.24-0.312-0.146-0.251 0.146-0.178 0.192-0.19 0-0.238 0.991-0.196 1.034-0.576-0.326 0 0.336-0.552 0.336-0.55 0.221-0.189 0.338-0.352 0.613-0.373 0.116-0.008 1.406-0.364 1.406-0.203 0.052 0.002 0.224 0.004 0.402 0.010-2.497-2.322-5.834-3.752-9.513-3.752-3.563 0-6.806 1.342-9.277 3.535 0.022 0.050 0.039 0.098 0.038 0.132 0.131-0.009 0.319-0.093 0.361 0.073-0.065-0.001-0.13-0.009-0.192-0.025 0.046 0.371-0.162 0.144-0.336 0.144 0-0.009-0.077-0.040-0.159-0.062-0.053 0.050-0.109 0.097-0.162 0.147 0.006 0.016-0.003 0.017 0.007 0.035 0.056 0 0.027 0.087 0.187 0.14 0.185 0.063 0.388 0.098 0.583 0.129 0.158 0.025 0.249-0.029 0.384-0.029 0-0.020 0.33-0.167 0.097-0.167 0.032-0.132-0.027-0.165-0.169-0.167 0.012-0.14 0.345-0.048 0.481-0.048 0.104-0.175 0.003-0.154 0.095-0.313 0.11-0.195 0.241-0.026 0.313-0.213 0.109 0.040 0.206 0.099 0.241 0.237 0.087 0.072 0.529 0.724 0.529 0.263 0.158 0.053 0.237 0.349 0.24 0.504 0.287-0.042 0.312-0.257 0.312-0.48 0.066 0-0.024-0.107-0.024-0.144 0.107-0.039 0.241 0.102 0.241-0.047 0.046 0 0.048 0.046 0.048 0.096 0.149 0.029 0.245-0.017 0.336 0.015 0.063 0.022 0.031 0.349 0.002 0.464-0.036 0.146-0.315 0.148-0.315 0.216-0.316 0.236 0.373 0.359 0.481 0.503-0.065 0-0.312-0.032-0.312-0.047-0.156 0-0.534 0.165-0.673 0.047 0.194 0 0.259-0.233 0.289-0.455-0.179-0.067-0.39 0.043-0.44 0.221-0.084 0.294-0.279-0.012-0.377 0.186-0.038 0.012-0.385 0.173-0.385 0.119-0.39 0.055-0.288 0.386-0.288 0.743 0.155 0.093 0.47 0.358 0.456 0.503 0.35 0.062 0.478 0.099 0.793 0.144 0.026 0.051 0.13 0.099 0.193 0.119 0 0.206 0.187 0.169 0.36 0.169 0-0.263 0.306 0.219 0.336 0.311-0.042 0 0.072 0.269 0.096 0.36-0.048-0.017-0.063 0-0.048 0.048 0.152 0.056 0.393 0.040 0.433-0.12-0.146 0-0.097-0.167-0.097-0.264-0.15-0.1-0.127-0.293 0.024-0.335 0 0.136 0.495-0.085 0.216-0.191 0.068-0.153 0.114-0.388 0.003-0.521-0.071-0.084-0.16 0-0.195-0.126 0.189-0.047 0.050-0.407 0.048-0.575 0.060-0.023 0.216 0.038 0.216 0 0.185 0 0.493 0.234 0.601-0.049 0.309 0.141 0.063 0.275 0.385 0.168 0 0.076 0.363 0.431 0.409 0.431 0 0.017-0.009 0.12 0.071 0.12 0 0.077-0.048-0.044-0.048 0.095 0.045 0.005 0.289 0.049 0.289-0.047 0.155 0 0.264-0.19 0.264-0.335 0.097-0.063 0.267 0.527 0.384 0.527 0.086 0.134 0.361 0.329 0.361 0.455 0.058 0.059 0.119 0.043 0.119 0.216 0.073 0 0.217-0.287 0.217-0.024 0.068 0 0.266 0.146 0.289 0.263-0.173 0-0.009 0.168-0.098 0.168 0 0.166-0.371 0.034-0.455 0.024-0.115 0.515-0.809 0.145-1.229 0.278-0.221 0.070-0.648 0.557-0.671 0.8 0.268 0.003 0.386-0.232 0.625-0.312 0.195 0 0.233-0.118 0.409-0.167 0 0.049 0.048 0.023 0.048 0.072-0.342 0-0.134 0.221-0.034 0.382 0.062 0.1 0.133 0.148 0.212 0.179-0.033 0.058-0.060 0.116-0.081 0.181 0 0.001-0.001 0-0.001 0.001-0.065 0.022-0.192 0.069-0.217 0.12-0.387 0.043-0.196 0.017-0.17-0.076 0.014 0.033 0.153 0.003 0.147 0.004-0.023-0.116-0.058-0.1-0.024-0.167-0.21 0-0.312 0.096-0.481 0.096-0.028 0.057-0.175 0.192-0.24 0.192-0.049 0.148-0.16 0.417-0.289 0.503 0-0.039-0.342 0.215-0.312 0.215-0.076 0.123-0.159 0.119-0.193 0.311-0.023 0.012-0.12 0.333-0.12 0.383-0.149 0.099-0.204 0.503-0.457 0.503-0.155 0.308-0.433 0.267-0.433 0.671 0.094 0.096 0.13 0.521 0.159 0.657 0.036 0.169 0.092 0.345-0.134 0.349-0.016-0.025-0.174-0.264-0.145-0.264 0-0.099-0.121-0.416-0.192-0.515-0.095-0.133-0.271 0.021-0.409-0.037-0.059-0.118-0.458-0.144-0.6-0.144 0.023 0.089 0.088 0.117 0.096 0.216-0.118 0.048-0.186 0.102-0.308 0.085-0.209-0.029-0.184-0.192-0.414-0.169-0.368 0.037-0.625 0.342-0.625 0.707-0.041 0-0.041 0.719 0 0.719 0 0.203 0.168 0.35 0.168 0.503 0.163 0 0.346 0.359 0.505 0.359 0.018 0.127-0.080 0.147 0.192 0.145 0-0.014 0.148-0.093 0.168-0.192-0.188-0.046-0.001-0.288 0.12-0.335 0 0.171 0.24-0.057 0.24-0.072 0.027-0.011 0.265-0.096 0.265-0.096 0-0.194 0.181 0.019 0.048 0.096-0.13 0-0.12 0.216-0.192 0.216-0.031 0.154-0.092 0.288-0.128 0.438-0.046 0.185 0.104 0.204 0.056 0.377 0.191 0.036 0.384 0.001 0.577 0 0.001-0.034-0.006-0.067-0.024-0.096 0.279 0 0.024 0.527 0.193 0.527 0 0.199 0.096 0.354 0.096 0.479 0.13 0.086 0.208 0.201 0.168 0.359 0.16 0.021 0.504 0.062 0.504-0.144 0.243 0 0.26 0.165 0.242 0.335 0.484 0 0.181-0.479 0.383-0.479 0.019-0.079 0.052-0.093 0.099-0.041 0.099 0.053 0.174-0.099 0.253-0.147 0.025-0.017 0.113-0.068 0.129-0.068 0.068 0.041 0.074 0.029 0.104 0.075 0.132-0.001 0.265-0.075 0.378-0.153 0.173 0.021 0.117 0.393 0.441 0.416 0.13 0.009 0.431 0.045 0.543-0.032 0.028-0.019 0.131 0.065 0.142 0.101 0.108 0 0.1 0.094 0.146 0.092 0.011 0.021 0.027 0.029 0.049 0.023 0.014 0.041 0.1 0.053 0.145 0.167 0 0.104 0.216 0.122 0.216 0.191 0.155 0.078-0.053 0.099 0.185 0.171 0.131 0.041 0.252 0.107 0.393 0.117 0.045-0.171 0.191 0.023 0.265 0.023 0.038 0.078 0.058 0.019 0.095 0.096 0.223 0.186 0.076 0.114 0.168 0.312 0.107 0.070 0.141 0.314 0.17 0.455-0.086 0-0.025 0.329-0.025 0.36-0.104 0 0.266 0.197 0.266-0.049 0.152 0.025 0.252 0.191 0.36 0.191-0.063 0.145 0.168 0.254 0.168 0.025 0.228 0.023 0.167 0.363 0.145 0.479 0.169 0 0.218-0.094 0.362-0.112 0.156-0.099 0.33-0.171 0.527-0.171 0.553 0 1 0.447 1 1 0 0.498-0.371 0.893-0.848 0.969-0.064 0.073-0.122 0.136-0.126 0.136 0 0.048-0.011 0.526-0.025 0.526 0 0.096-0.073 0.623-0.144 0.623 0 0.271-0.177 0.32-0.24 0.575-0.146 0.108-0.541 0.288-0.602 0.407-0.113 0-0.197 0.096-0.312 0.096-0.016 0.033-0.261 0.264-0.217 0.264-0.018 0.17 0.013 0.57-0.079 0.682-0.062 0.074-0.151 0.066-0.112 0.182-0.135 0 0.008 0.096-0.205 0.096-0.134 0-0.373 0.191-0.38 0.353-0.009 0.198-0.062 0.341-0.232 0.462 0 0.068-0.312 0.088-0.312 0.264 0.029 0 0 0.326 0 0.359-0.093-0.003-0.321 0.090-0.36 0.167-0.314 0-0.276 0.032-0.48 0.168 0 0.042-0.029 0.191-0.072 0.191 0 0.243-0.173 0.022-0.313 0.145 0.055 0 0.125 0.239 0.096 0.239 0 0.211-0.131 0.229-0.264 0.384-0.063 0.042-0.123 0.216-0.168 0.216 0 0.142-0.071 0.271-0.071 0.407 0.030 0 0.002 0.061 0.023 0.118 0.067-0.019 0.069-0.095 0.096-0.095 0-0.12 0.191 0.071 0.072 0.071-0.099 0.15-0.206 0.153-0.265 0.36-0.060 0-0.112 0.058-0.156 0.126 1.178 0.321 2.414 0.509 3.696 0.509 4.924 0 9.246-2.548 11.742-6.393 0.015-0.354 0.070-0.692 0.109-0.809 0.098 0.072 0.171 0.207 0.24 0-0.173-0.034-0.131-0.094-0.072-0.239 0.066 0.040 0.199 0.089 0.307 0.082 0.033-0.062 0.059-0.128 0.092-0.19-0.098-0.076 0.037-0.273 0.084-0.177 0.025-0.048 0.047-0.098 0.070-0.146-0.011-0.003-0.008 0.004-0.024-0.001 0-0.087 0.016-0.076 0.073-0.12 0.001 0.009 0 0.009 0.002 0.017 0.873-1.827 1.377-3.864 1.377-6.024 0-0.071-0.010-0.139-0.011-0.21-0.026 0.098-0.075 0.204-0.144 0.228 0 0.063-0.715 0.374-0.672 0.503-0.126 0-0.568 0.126-0.649 0.287-0.089 0-0.448 0.127-0.481 0.192-0.446 0.001-0.361-0.526-0.576-0.526zM29.5 11h-0.531c-0.004-0.005-0.008-0.006-0.012-0.013-0.027 0-0.14-0.254-0.096-0.312 0.043 0 0.063 0.004 0.086 0.006-0.045-0.11-0.094-0.218-0.143-0.327-0.108 0.074-0.203 0.168-0.352 0.177 0 0.041-0.213 0.455 0 0.455 0 0.008 0.004 0.014 0.006 0.021-0.255 0.024-0.458 0.232-0.458 0.493 0 0.276 0.224 0.5 0.5 0.5h0.197c0.012 0.091 0.061 0.17 0.236 0.209 0.055 0.231 0.467 0.313 0.529 0.071-0.174 0-0.117-0.167-0.102-0.28h0.14c0.275 0 0.5-0.224 0.5-0.5s-0.225-0.5-0.5-0.5zM28.043 17.502c0.035 0.002 0.266-0.004 0.266-0.045 0.209 0 0.492-0.029 0.697-0.097 0 0.31-0.261 0.483-0.217 0.791-0.173 0-0.097 0.178-0.097 0.239-0.112 0.069-0.129 0.195-0.264 0.264 0 0.139-0.312 0.369-0.404 0.488-0.104 0.133-0.417 0.364-0.458 0.533 0.011-0.040-0.572 0.607-0.436 0.607 0 0.121-0.164 1.078 0.048 1.078 0 0.084 0.181 0.887 0.071 0.887 0 0.258-0.168 0.416-0.168 0.622-0.082 0.056-0.199 0.087-0.24 0.169-0.147 0-0.218 0.312-0.288 0.312 0 0.333-0.097 0.58-0.097 0.958 0.027 0-0.192 0.539-0.192 0.574-0.177 0.119-0.625 0.546-0.625 0.768 0 0-0.312 0.438-0.36 0.503-0.094 0-0.818 0.136-0.818 0.192-0.154 0-0.552 0.121-0.648-0.024 0-0.152-0.083-0.345-0.096-0.552-0.074 0-0.086-0.311-0.168-0.311 0-0.066-0.459-0.983-0.385-0.983 0-0.095-0.082-0.407-0.096-0.407 0-0.33-0.241-0.605-0.241-0.91-0.071 0-0.218-0.67-0.144-0.67 0-0.352 0.123-0.582 0.174-0.973 0.057-0.429-0.027-0.69-0.102-0.993-0.041 0-0.179-0.229-0.193-0.287-0.193-0.128-0.264-0.382-0.264-0.622 0.126-0.144 0.176-0.685 0.145-0.863-0.243-0.115-0.34-0.072-0.602-0.072-0.155-0.311-1.196-0.119-1.491-0.119 0 0.17-0.725-0.033-0.793-0.168-0.177 0-0.528-0.376-0.528-0.551-0.194-0.129-0.504-0.771-0.504-0.982-0.168-0.084-0.117-0.408-0.025-0.408 0.023-0.090-0.059-0.374-0.098-0.509-0.029-0.101 0.098-0.21 0.098-0.33 0-0.334 0.008-0.488 0.195-0.845 0.059-0.112 0.134-0.217 0.189-0.357 0.1-0.251 0.13-0.012 0.265-0.236 0.129-0.064 0.204-0.278 0.337-0.383 0.058-0.077 0.060-0.109 0-0.168 0.026 0 0.168-0.369 0.168-0.454 0.188-0.261 0.055-0.142 0.24-0.12 0.068-0.074 0.181-0.264 0.288-0.264 0.047-0.093 0.165-0.144 0.265-0.144 0 0.144 0.392-0.047 0.433-0.047 0.067-0.135 0.499-0.288 0.601-0.288 0-0.164 0.852 0.046 0.986 0.024 0-0.024 0-0.048 0-0.072 0.182 0.043 0.514 0.773 0.48 0.935 0.14 0 0.27-0.023 0.361 0 0 0.155 0.292 0.193 0.425 0.2 0.185 0.009 0.728-0.019 0.728-0.272 0.143 0 0.27 0.1 0.242 0.263 0.162 0.018 1.125 0.037 1.057 0.239 0.141 0 0.177 0.241 0.312 0.241-0.027 0.166 0.168 0.599 0.312 0.599 0 0.144 0.090 0.409 0.217 0.502 0.068 0.206 0.293 0.64 0.504 0.767-0.090 0.17 0.137 0.31 0.193 0.479-0.013 0 0.049 0.251 0.119 0.288 0 0.17 0.358 0.863 0.554 0.863 0.013 0.084-0.184 0.122 0.072 0.141zM22.852 12.137c0.037-0.143 0.121-0.032 0.199-0.006 0.185 0.060 0.121-0.003 0.258-0.065 0 0.39-0.224 0.094-0.457 0.071zM22.346 11.418c0.098 0 0.125 0.44-0.144 0.359 0-0.109-0.069-0.311 0.073-0.311 0.041 0.17 0.071 0.101 0.071-0.048zM22.227 11.131c0.111 0.048 0.16 0.032 0.144-0.048 0.146 0.048-0.019 0.152-0.048 0.264-0.075-0.074-0.052-0.1-0.096-0.216zM19.654 8.998c-0.236-0.061 0.243-0.131 0.264-0.191-0.080 0-0.135-0.083-0.104-0.153 0.036-0.083 0.095 0.099 0.177 0.058 0.097-0.010 0.288-0.155 0.19 0.125-0.1 0.284-0.191 0.492-0.551 0.497-0.129-0.13-0.005-0.198 0.024-0.336zM20.544 8.016c0.194 0 0.024 0.144-0.019 0.144 0.033 0.013-0.006 0.129-0.006 0.167 0.18-0.002 0.183-0.112 0.312-0.144-0.027 0.161-0.207 0.192-0.031 0.33 0.093 0.073 0.188 0.159 0.151 0.27 0.229 0 0.263 0.22 0.216 0.479 0.127 0 0.121 0.006 0.121-0.121 0.123 0.034 0.114 0.145 0 0.145-0.114 0.225-0.413 0.215-0.625 0.215-0.002-0.174-0.035-0.185-0.196-0.136-0.22 0.067-0.048-0.175-0.044-0.295 0.024 0 0.499 0.022 0.216-0.072-0.015-0.258-0.073-0.335-0.312-0.335 0-0.176-0.062-0.163-0.091-0.356-0.041-0.285 0.223 0.020 0.308-0.291zM20.471 9.573c0 0.059-0.12 0.106-0.144 0.023 0.023 0.008 0.032 0 0.023-0.023 0.041 0 0.082 0 0.121 0zM18.5 7h-1c-0.276 0-0.5-0.224-0.5-0.5s0.224-0.5 0.5-0.5h1c0.276 0 0.5 0.224 0.5 0.5s-0.224 0.5-0.5 0.5zM12.674 15.85c0.056 0 0.121 0.022 0.121 0.072-0.073 0-0.167 0.069-0.121-0.072zM11.762 15.899c-0.040 0.076-0.364 0.063-0.409-0.025 0.12 0 0.213 0.049 0.336 0 0-0.066-0.055-0.119-0.096-0.191 0.131 0 0.278 0.1 0.457 0.096 0-0.111-0.049 0.024 0-0.12 0.075 0.019 0.256 0.191 0.264 0.263-0.263-0.028-0.275-0.023-0.552-0.023zM10.704 15.324c-0.123 0-0.36-0.107-0.433-0.216 0.119 0.005 0.237 0.054 0.312-0.072 0.305 0.031 0.332 0.241 0.577 0.241 0.046 0.081 0.308 0.267 0.055 0.291-0.191 0.018-0.431-0.086-0.511-0.244zM10.896 15.995c-0.089 0-0.236 0.039-0.168-0.145 0.118 0.016 0.174 0.065 0.168 0.145zM11.064 15.971c-0.048 0.008-0.096 0.016-0.144 0.024 0.014-0.111 0.119-0.235 0.144-0.024zM11.953 17.024c-0.019 0.067-0.016 0.071-0.095 0.071 0.008-0.031 0.015-0.062 0.023-0.095 0.025 0.008 0.048 0.016 0.072 0.024zM9.79 15.036c0.023 0.008 0.048 0.017 0.072 0.024 0.031 0.119 0.096 0.060 0.168 0.024 0 0.139-0.322 0.179-0.24-0.048z"
    ],
    description: (
      <>
        Lyvely offers multi-language support for your modules, with translation capabilities in both the frontend and
        backend. Users can configure locales, calendar preferences, and timezones to suit their needs.
      </>
    ),
  },
  {
    title: 'Realtime',
    svgViewBox: '0 0 20 20',
    svgPaths: [
      'M2.93 17.070c-1.884-1.821-3.053-4.37-3.053-7.193 0-5.523 4.477-10 10-10 2.823 0 5.372 1.169 7.19 3.050l0.003 0.003c1.737 1.796 2.807 4.247 2.807 6.947 0 5.523-4.477 10-10 10-2.7 0-5.151-1.070-6.95-2.81l0.003 0.003zM15.66 15.66c1.449-1.449 2.344-3.45 2.344-5.66 0-4.421-3.584-8.004-8.004-8.004-2.21 0-4.211 0.896-5.66 2.344v0c-1.449 1.449-2.344 3.45-2.344 5.66 0 4.421 3.584 8.004 8.004 8.004 2.21 0 4.211-0.896 5.66-2.344v0zM7 6l8 4-8 4v-8z'
    ],
    description: (
      <>
        The Live API enables the implementation of real-time features and live updates for your module view, ensuring a
        responsive and modern user experience. Effortlessly implement type-safe real-time updates for your collaborative
        tools and keep your users up to date.
      </>
    ),
  },
  {
    title: 'Ui',
    svgViewBox: '0 0 32 32',
    svgPaths: [
      'M27.555 8.42c-1.355 1.647-5.070 6.195-8.021 9.81l-3.747-3.804c3.389-3.016 7.584-6.744 9.1-8.079 2.697-2.377 5.062-3.791 5.576-3.213 0.322 0.32-0.533 2.396-2.908 5.286zM18.879 19.030c-1.143 1.399-2.127 2.604-2.729 3.343l-4.436-4.323c0.719-0.64 1.916-1.705 3.304-2.939l3.861 3.919zM15.489 23.183v-0.012c-2.575 9.88-14.018 4.2-14.018 4.2s4.801 0.605 4.801-3.873c0-4.341 4.412-4.733 4.683-4.753l4.543 4.427c0 0.001-0.009 0.011-0.009 0.011z'
    ],
    description: (
      <>
        Lyvely features a custom UI component library that ensures a unique and cohesive look and feel across the
        platform. This library includes components highly adapted to the platform, ranging from simple buttons and forms to
        complex layouts and extendable utility components like stacks and menus.
      </>
    ),
  },
  {
    title: 'Type-Safe Api',
    svgViewBox: '0 0 32 32',
    svgPaths: [
      'M0 16v16h32v-32h-32zM25.788 14.725c0.813 0.203 1.432 0.564 2.001 1.153 0.295 0.315 0.732 0.888 0.767 1.027 0.011 0.040-1.381 0.973-2.224 1.497-0.031 0.020-0.153-0.112-0.289-0.315-0.413-0.6-0.844-0.859-1.504-0.904-0.971-0.067-1.595 0.441-1.589 1.289-0.001 0.015-0.001 0.032-0.001 0.050 0 0.201 0.051 0.391 0.14 0.557l-0.003-0.006c0.213 0.441 0.611 0.707 1.853 1.244 2.292 0.987 3.272 1.636 3.881 2.56 0.68 1.031 0.833 2.677 0.371 3.901-0.507 1.331-1.767 2.235-3.54 2.533-0.548 0.097-1.848 0.083-2.437-0.024-1.285-0.229-2.504-0.864-3.256-1.697-0.295-0.324-0.869-1.173-0.833-1.233 0.015-0.021 0.147-0.103 0.293-0.188 0.144-0.081 0.681-0.392 1.189-0.687l0.92-0.533 0.193 0.285c0.269 0.411 0.857 0.975 1.213 1.163 1.021 0.539 2.423 0.463 3.113-0.157 0.257-0.217 0.419-0.54 0.419-0.9 0-0.021-0.001-0.042-0.002-0.062l0 0.003c0-0.371-0.047-0.533-0.24-0.813-0.248-0.355-0.756-0.653-2.199-1.28-1.651-0.711-2.361-1.152-3.012-1.853-0.392-0.445-0.694-0.981-0.871-1.57l-0.008-0.030c-0.121-0.452-0.152-1.585-0.056-2.041 0.34-1.596 1.544-2.707 3.281-3.037 0.564-0.107 1.875-0.067 2.428 0.071zM18.276 16.061l0.011 1.311h-4.167v11.835h-2.947v-11.835h-4.163v-1.285c0-0.712 0.015-1.307 0.035-1.32 0.016-0.021 2.551-0.032 5.623-0.027l5.593 0.016z'
    ],
    description: (
      <>
        As a full-stack TypeScript platform, Lyvely enables the implementation of type-safe and reusable interfaces and
        features. This is achieved by splitting features into three packages: a frontend, a backend, and one
        interface package, all managed within a monorepo.
      </>
    ),
  },
];

const UserFeatureList: FeatureItem[] = [
  {
    title: 'Profiles',
    svgViewBox: '0 0 20 20',
    svgPaths: [
      'M15.989 19.129c0-2.246-2.187-3.389-4.317-4.307-2.123-0.914-2.801-1.684-2.801-3.334 0-0.989 0.648-0.667 0.932-2.481 0.12-0.752 0.692-0.012 0.802-1.729 0-0.684-0.313-0.854-0.313-0.854s0.159-1.013 0.221-1.793c0.064-0.817-0.398-2.56-2.301-3.095-0.332-0.341-0.557-0.882 0.467-1.424-2.24-0.104-2.761 1.068-3.954 1.93-1.015 0.756-1.289 1.953-1.24 2.59 0.065 0.78 0.223 1.793 0.223 1.793s-0.314 0.17-0.314 0.854c0.11 1.718 0.684 0.977 0.803 1.729 0.284 1.814 0.933 1.492 0.933 2.481 0 1.65-0.212 2.21-2.336 3.124-2.131 0.917-2.794 2.387-2.783 4.516 0.003 0.637-0.011 0.871-0.011 0.871h16c0 0-0.011-0.234-0.011-0.871zM18.528 13.365c-1.135-0.457-1.605-1.002-1.605-2.066 0-0.641 0.418-0.432 0.602-1.603 0.077-0.484 0.447-0.008 0.518-1.115 0-0.441-0.202-0.551-0.202-0.551s0.103-0.656 0.143-1.159c0.050-0.627-0.364-2.247-2.268-2.247s-2.318 1.62-2.269 2.247c0.042 0.502 0.144 1.159 0.144 1.159s-0.202 0.109-0.202 0.551c0.071 1.107 0.441 0.631 0.518 1.115 0.184 1.172 0.602 0.963 0.602 1.603 0 1.064-0.438 1.562-1.809 2.152-0.069 0.029-0.12 0.068-0.183 0.102 1.64 0.712 4.226 1.941 4.838 4.447h2.645c0 0 0-1.906 0-2.318 0-1-0.273-1.834-1.472-2.317z'
    ],
    description: (
      <>
        Create multiple profiles from private single user profiles to public group or organization profiles. Profiles
        are isolated areas within the platform with an own set of members, permissions and set of feature.
      </>
    ),
  },
  {
    title: 'Habits',
    svgViewBox: '0 0 24 24',
    svgPaths: [
      'M21.984 5.203l-11.391 11.391-4.266-4.219 1.453-1.406 2.813 2.813 9.984-9.984zM12 20.016q-1.641 0-3.094-0.633t-2.555-1.734-1.734-2.555-0.633-3.094 0.633-3.094 1.734-2.555 2.555-1.734 3.094-0.633q1.172 0 2.25 0.328t2.016 0.938l1.453-1.453q-1.219-0.844-2.672-1.313t-3.047-0.469q-2.063 0-3.867 0.773t-3.188 2.156-2.156 3.188-0.773 3.867 0.773 3.867 2.156 3.188 3.188 2.156 3.867 0.773q1.313 0 2.508-0.305t2.273-0.914l-1.5-1.5q-0.75 0.375-1.57 0.563t-1.711 0.188zM18.984 15h-3v2.016h3v3h2.016v-3h3v-2.016h-3v-3h-2.016v3z'
    ],
    description: (
      <>
        Habits enable you to monitor recurring activities through a calendar-plan view. The Habits module supports both
        'shared' and 'per-user' habits, allowing for collaborative tracking or individual monitoring by each profile member.
      </>
    ),
  },
  {
    title: 'Tasks',
    svgViewBox: '0 0 24 24',
    svgPaths: [
      'M16 19h-8c-1.654 0-3-1.346-3-3v-8c0-1.654 1.346-3 3-3h5c0.553 0 1 0.448 1 1s-0.447 1-1 1h-5c-0.552 0-1 0.449-1 1v8c0 0.551 0.448 1 1 1h8c0.552 0 1-0.449 1-1v-3c0-0.552 0.447-1 1-1s1 0.448 1 1v3c0 1.654-1.346 3-3 3z',
      'M13.166 14.833c-0.35 0-0.689-0.139-0.941-0.391l-2.668-2.667c-0.52-0.521-0.52-1.365 0-1.885s1.365-0.521 1.887 0l1.416 1.417 3.475-5.455c0.357-0.644 1.17-0.877 1.814-0.519s0.875 1.17 0.518 1.813l-4.334 7c-0.203 0.366-0.566 0.615-0.98 0.673-0.064 0.010-0.124 0.014-0.187 0.014z',
    ],
    description: (
      <>
        Manage 'shared' or 'per-user' tasks and discuss upcoming tasks with your team. Use the calendar-plan view to
        filter, prioritize and schedule tasks in a profile.
      </>
    ),
  },
  {
    title: 'Milestones',
    svgViewBox: '0 0 24 24',
    svgPaths: [
      'M23 12c0-3.037-1.232-5.789-3.222-7.778s-4.741-3.222-7.778-3.222-5.789 1.232-7.778 3.222-3.222 4.741-3.222 7.778 1.232 5.789 3.222 7.778 4.741 3.222 7.778 3.222 5.789-1.232 7.778-3.222 3.222-4.741 3.222-7.778zM21 12c0 2.486-1.006 4.734-2.636 6.364s-3.878 2.636-6.364 2.636-4.734-1.006-6.364-2.636-2.636-3.878-2.636-6.364 1.006-4.734 2.636-6.364 3.878-2.636 6.364-2.636 4.734 1.006 6.364 2.636 2.636 3.878 2.636 6.364zM19 12c0-1.933-0.785-3.684-2.050-4.95s-3.017-2.050-4.95-2.050-3.684 0.785-4.95 2.050-2.050 3.017-2.050 4.95 0.785 3.684 2.050 4.95 3.017 2.050 4.95 2.050 3.684-0.785 4.95-2.050 2.050-3.017 2.050-4.95zM17 12c0 1.381-0.559 2.63-1.464 3.536s-2.155 1.464-3.536 1.464-2.63-0.559-3.536-1.464-1.464-2.155-1.464-3.536 0.559-2.63 1.464-3.536 2.155-1.464 3.536-1.464 2.63 0.559 3.536 1.464 1.464 2.155 1.464 3.536zM15 12c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879-1.58 0.337-2.121 0.879-0.879 1.293-0.879 2.121 0.337 1.58 0.879 2.121 1.293 0.879 2.121 0.879 1.58-0.337 2.121-0.879 0.879-1.293 0.879-2.121zM13 12c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293-0.525-0.111-0.707-0.293-0.293-0.431-0.293-0.707 0.111-0.525 0.293-0.707 0.431-0.293 0.707-0.293 0.525 0.111 0.707 0.293 0.293 0.431 0.293 0.707z',
    ],
    description: (
      <>
        The “Milestones” feature can be used to track and discuss the progression of different types of content by
        summarizing them in a milestone which can be prioritized and scheduled through a calendar-plan view.
      </>
    ),
  },
  {
    title: 'Journals',
    svgViewBox: '0 0 24 24',
    svgPaths: [
      'M17.484 14.344q1.219 0 2.531 0.234v1.5q-0.938-0.234-2.531-0.234-2.813 0-4.5 0.984v-1.688q1.781-0.797 4.5-0.797zM12.984 12.469q1.969-0.797 4.5-0.797 1.219 0 2.531 0.234v1.5q-0.938-0.234-2.531-0.234-2.813 0-4.5 0.984v-1.688zM17.484 10.5q-2.813 0-4.5 0.984v-1.641q1.875-0.844 4.5-0.844 1.219 0 2.531 0.234v1.547q-1.125-0.281-2.531-0.281zM21 18.516v-11.531q-1.547-0.469-3.516-0.469-3.047 0-5.484 1.5v11.484q2.438-1.5 5.484-1.5 1.828 0 3.516 0.516zM17.484 4.5q3.563 0 5.531 1.5v14.578q0 0.188-0.164 0.352t-0.352 0.164q-0.141 0-0.234-0.047-1.922-1.031-4.781-1.031-3.047 0-5.484 1.5-2.016-1.5-5.484-1.5-2.531 0-4.781 1.078-0.047 0-0.117 0.023t-0.117 0.023q-0.188 0-0.352-0.141t-0.164-0.328v-14.672q2.016-1.5 5.531-1.5 3.469 0 5.484 1.5 2.016-1.5 5.484-1.5z',
    ],
    description: (
      <>
        The Journals feature is meant to track any kind of recurring data for reporting purposes in a calendar-plan view
        and supports additional input types as 'text', 'number', 'time', 'dropdown' and 'radio' selections.
      </>
    ),
  },
  {
    title: 'Analytics',
    svgViewBox: '0 0 32 32',
    svgPaths: [
      'M0 26h32v4h-32zM4 18h4v6h-4zM10 10h4v14h-4zM16 16h4v8h-4zM22 4h4v20h-4z'
    ],
    description: (
      <>
        The Analytics feature is a powerful tool for evaluating data such as habit and journal data as well as profile
        scores by creating customized charts. This feature allows you to add and combine multiple chart series to
        analyze the correlations between your profile data
      </>
    ),
  },
  {
    title: 'Legal',
    svgViewBox: '0 0 24 24',
    svgPaths: [
      'M12 0.984l-9 4.031v6q0 2.063 0.68 4.008t1.898 3.586 2.859 2.789 3.563 1.617q1.922-0.469 3.563-1.617t2.859-2.789 1.898-3.586 0.68-4.008v-6l-9-4.031zM11.016 6.984h1.969v2.016h-1.969v-2.016zM11.016 11.016h1.969v6h-1.969v-6z'
    ],
    description: (
      <>
        The Legal module is used to manage legal links and translatable texts, as privacy notes terms of service which are
        embedded in certain parts of your platform to comply with regulatory requirements and ensure legal compliance. At the
        moment the links and texts are managed by configuration file
      </>
    ),
  },
  {
    title: 'Messages',
    svgViewBox: '0 0 24 24',
    svgPaths: [
      'M18 8.016v-2.016h-12v2.016h12zM18 11.016v-2.016h-12v2.016h12zM18 14.016v-2.016h-12v2.016h12zM20.016 2.016q0.797 0 1.383 0.586t0.586 1.383v12q0 0.797-0.586 1.406t-1.383 0.609h-14.016l-3.984 3.984v-18q0-0.797 0.586-1.383t1.383-0.586h16.031z'
    ],
    description: (
      <>
        Messages represent the simplest form of content and can be used to chat with other profile members. Both messages
        and most other content types support Markdown syntax for text formatting.
      </>
    ),
  },
  {
    title: 'Stream',
    svgViewBox: '0 0 24 24',
    svgPaths: [
      'M3 13h18c0.552 0 1-0.448 1-1s-0.448-1-1-1h-18c-0.552 0-1 0.448-1 1s0.448 1 1 1zM3 7h18c0.552 0 1-0.448 1-1s-0.448-1-1-1h-18c-0.552 0-1 0.448-1 1s0.448 1 1 1zM3 19h18c0.552 0 1-0.448 1-1s-0.448-1-1-1h-18c-0.552 0-1 0.448-1 1s0.448 1 1 1z'
    ],
    description: (
      <>
        The Stream can be used to communicate with other profile members or for brainstorming and information management.
        The stream contains various types of content in a chat-like view. Each content entry supports multi-level
        sub-discussions consisting of streams themselves.
      </>
    ),
  },
];

function Feature({title, svgPaths, svgViewBox, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4 relative')}>
      <svg viewBox={svgViewBox} className="w-5 text-primary absolute left-0 top-[5px]">
        {svgPaths.map((path, idx) => (
          <path fill="currentColor" d={path}></path>
        ))}
      </svg>
      <div className="mx-4 text-left">
        <h4 className="text-lg mb-2 font-semibold text-gray-600 dark:text-gray-100">{title}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">{description}</p>
      </div>
    </div>
  );
}

type FeatureCategory = {
  id: string;
  features: FeatureItem[];
  sub: string;
};

const categories: Record<'user' | 'dev', FeatureCategory> = {
  user: {
    id: 'user',
    features: UserFeatureList,
    sub: 'Powerful self-management and collaboration tools out of the box.'
  },
  dev: {
    id: 'dev',
    features: DevFeatureList,
    sub: 'Powered by an expressive framework for building self-management and collaboration platforms.'
  }
}

export default function HomepageFeatures(): JSX.Element {
  const [category, setCategory] = useState(categories.user);

  return (
    <section className={styles.features}>
      <div className="container text-center">
        <h1 className="text-2xl text-primary">
          Features at a glance
        </h1>
        <div class="flex justify-center mb-8">
          <button
            class={clsx({"bg-gray-300 dark:bg-gray-700": category.id === "user"}, {"bg-gray-100 dark:bg-gray-900": category.id !== "user"}, "rounded-l-xl rounded-r-none px-2.5 py-2 border-0 cursor-pointer")}
            onClick={() => setCategory(categories.user)}>
            Users
          </button>
          <button
            class={clsx({"bg-gray-300 dark:bg-gray-700": category.id === "dev"}, {"bg-gray-100 dark:bg-gray-900": category.id !== "dev"}, "rounded-r-xl rounded-l-none px-2.5 py-2 border-0 cursor-pointer")}
            onClick={() => setCategory(categories.dev)}>
            Developers
          </button>
        </div>
        <h2 className="text-xl text-gray-400 mt-4 mb-6">
          {category.sub}
        </h2>
        <div className="row">
          {category.features.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
