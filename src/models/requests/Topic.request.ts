import { ParamsDictionary } from 'express-serve-static-core';

// Body: Tạo chủ đề
export interface CreateTopicReqBody {
  name: string;
  description?: string;
}

// Body: Cập nhật chủ đề
export interface UpdateTopicReqBody {
  name?: string;
  description?: string;
}

// Params: Cập nhật chủ đề
export interface UpdateTopicReqParams extends ParamsDictionary {
  topic_id: string;
}

// Body: Xóa chủ đề (một hoặc nhiều)
export interface DeleteTopicsReqBody {
  topic_ids: string[];
}
