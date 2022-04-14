// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.27.1
// 	protoc        v3.14.0
// source: orgs/examples/proto/example.proto

package example

import (
	protoreflect "google.golang.org/protobuf/reflect/protoreflect"
	protoimpl "google.golang.org/protobuf/runtime/protoimpl"
	reflect "reflect"
	sync "sync"
)

const (
	// Verify that this generated code is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(20 - protoimpl.MinVersion)
	// Verify that runtime/protoimpl is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(protoimpl.MaxVersion - 20)
)

type Person struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Id   string `protobuf:"bytes,1,opt,name=id,proto3" json:"id,omitempty"`
	Name string `protobuf:"bytes,2,opt,name=name,proto3" json:"name,omitempty"`
}

func (x *Person) Reset() {
	*x = Person{}
	if protoimpl.UnsafeEnabled {
		mi := &file_orgs_examples_proto_example_proto_msgTypes[0]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *Person) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Person) ProtoMessage() {}

func (x *Person) ProtoReflect() protoreflect.Message {
	mi := &file_orgs_examples_proto_example_proto_msgTypes[0]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use Person.ProtoReflect.Descriptor instead.
func (*Person) Descriptor() ([]byte, []int) {
	return file_orgs_examples_proto_example_proto_rawDescGZIP(), []int{0}
}

func (x *Person) GetId() string {
	if x != nil {
		return x.Id
	}
	return ""
}

func (x *Person) GetName() string {
	if x != nil {
		return x.Name
	}
	return ""
}

type GetPersonsRequest struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields
}

func (x *GetPersonsRequest) Reset() {
	*x = GetPersonsRequest{}
	if protoimpl.UnsafeEnabled {
		mi := &file_orgs_examples_proto_example_proto_msgTypes[1]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *GetPersonsRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*GetPersonsRequest) ProtoMessage() {}

func (x *GetPersonsRequest) ProtoReflect() protoreflect.Message {
	mi := &file_orgs_examples_proto_example_proto_msgTypes[1]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use GetPersonsRequest.ProtoReflect.Descriptor instead.
func (*GetPersonsRequest) Descriptor() ([]byte, []int) {
	return file_orgs_examples_proto_example_proto_rawDescGZIP(), []int{1}
}

type GetPersonsResponse struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Persons []*Person `protobuf:"bytes,1,rep,name=persons,proto3" json:"persons,omitempty"`
	Next    string    `protobuf:"bytes,2,opt,name=next,proto3" json:"next,omitempty"`
	Prev    string    `protobuf:"bytes,3,opt,name=prev,proto3" json:"prev,omitempty"`
}

func (x *GetPersonsResponse) Reset() {
	*x = GetPersonsResponse{}
	if protoimpl.UnsafeEnabled {
		mi := &file_orgs_examples_proto_example_proto_msgTypes[2]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *GetPersonsResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*GetPersonsResponse) ProtoMessage() {}

func (x *GetPersonsResponse) ProtoReflect() protoreflect.Message {
	mi := &file_orgs_examples_proto_example_proto_msgTypes[2]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use GetPersonsResponse.ProtoReflect.Descriptor instead.
func (*GetPersonsResponse) Descriptor() ([]byte, []int) {
	return file_orgs_examples_proto_example_proto_rawDescGZIP(), []int{2}
}

func (x *GetPersonsResponse) GetPersons() []*Person {
	if x != nil {
		return x.Persons
	}
	return nil
}

func (x *GetPersonsResponse) GetNext() string {
	if x != nil {
		return x.Next
	}
	return ""
}

func (x *GetPersonsResponse) GetPrev() string {
	if x != nil {
		return x.Prev
	}
	return ""
}

type CreatePersonRequest struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Name string `protobuf:"bytes,1,opt,name=name,proto3" json:"name,omitempty"`
}

func (x *CreatePersonRequest) Reset() {
	*x = CreatePersonRequest{}
	if protoimpl.UnsafeEnabled {
		mi := &file_orgs_examples_proto_example_proto_msgTypes[3]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *CreatePersonRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*CreatePersonRequest) ProtoMessage() {}

func (x *CreatePersonRequest) ProtoReflect() protoreflect.Message {
	mi := &file_orgs_examples_proto_example_proto_msgTypes[3]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use CreatePersonRequest.ProtoReflect.Descriptor instead.
func (*CreatePersonRequest) Descriptor() ([]byte, []int) {
	return file_orgs_examples_proto_example_proto_rawDescGZIP(), []int{3}
}

func (x *CreatePersonRequest) GetName() string {
	if x != nil {
		return x.Name
	}
	return ""
}

type GetPersonByIDRequest struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Id string `protobuf:"bytes,1,opt,name=id,proto3" json:"id,omitempty"`
}

func (x *GetPersonByIDRequest) Reset() {
	*x = GetPersonByIDRequest{}
	if protoimpl.UnsafeEnabled {
		mi := &file_orgs_examples_proto_example_proto_msgTypes[4]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *GetPersonByIDRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*GetPersonByIDRequest) ProtoMessage() {}

func (x *GetPersonByIDRequest) ProtoReflect() protoreflect.Message {
	mi := &file_orgs_examples_proto_example_proto_msgTypes[4]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use GetPersonByIDRequest.ProtoReflect.Descriptor instead.
func (*GetPersonByIDRequest) Descriptor() ([]byte, []int) {
	return file_orgs_examples_proto_example_proto_rawDescGZIP(), []int{4}
}

func (x *GetPersonByIDRequest) GetId() string {
	if x != nil {
		return x.Id
	}
	return ""
}

var File_orgs_examples_proto_example_proto protoreflect.FileDescriptor

var file_orgs_examples_proto_example_proto_rawDesc = []byte{
	0x0a, 0x21, 0x6f, 0x72, 0x67, 0x73, 0x2f, 0x65, 0x78, 0x61, 0x6d, 0x70, 0x6c, 0x65, 0x73, 0x2f,
	0x70, 0x72, 0x6f, 0x74, 0x6f, 0x2f, 0x65, 0x78, 0x61, 0x6d, 0x70, 0x6c, 0x65, 0x2e, 0x70, 0x72,
	0x6f, 0x74, 0x6f, 0x12, 0x07, 0x65, 0x78, 0x61, 0x6d, 0x70, 0x6c, 0x65, 0x22, 0x2c, 0x0a, 0x06,
	0x50, 0x65, 0x72, 0x73, 0x6f, 0x6e, 0x12, 0x0e, 0x0a, 0x02, 0x69, 0x64, 0x18, 0x01, 0x20, 0x01,
	0x28, 0x09, 0x52, 0x02, 0x69, 0x64, 0x12, 0x12, 0x0a, 0x04, 0x6e, 0x61, 0x6d, 0x65, 0x18, 0x02,
	0x20, 0x01, 0x28, 0x09, 0x52, 0x04, 0x6e, 0x61, 0x6d, 0x65, 0x22, 0x13, 0x0a, 0x11, 0x47, 0x65,
	0x74, 0x50, 0x65, 0x72, 0x73, 0x6f, 0x6e, 0x73, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x22,
	0x67, 0x0a, 0x12, 0x47, 0x65, 0x74, 0x50, 0x65, 0x72, 0x73, 0x6f, 0x6e, 0x73, 0x52, 0x65, 0x73,
	0x70, 0x6f, 0x6e, 0x73, 0x65, 0x12, 0x29, 0x0a, 0x07, 0x70, 0x65, 0x72, 0x73, 0x6f, 0x6e, 0x73,
	0x18, 0x01, 0x20, 0x03, 0x28, 0x0b, 0x32, 0x0f, 0x2e, 0x65, 0x78, 0x61, 0x6d, 0x70, 0x6c, 0x65,
	0x2e, 0x50, 0x65, 0x72, 0x73, 0x6f, 0x6e, 0x52, 0x07, 0x70, 0x65, 0x72, 0x73, 0x6f, 0x6e, 0x73,
	0x12, 0x12, 0x0a, 0x04, 0x6e, 0x65, 0x78, 0x74, 0x18, 0x02, 0x20, 0x01, 0x28, 0x09, 0x52, 0x04,
	0x6e, 0x65, 0x78, 0x74, 0x12, 0x12, 0x0a, 0x04, 0x70, 0x72, 0x65, 0x76, 0x18, 0x03, 0x20, 0x01,
	0x28, 0x09, 0x52, 0x04, 0x70, 0x72, 0x65, 0x76, 0x22, 0x29, 0x0a, 0x13, 0x43, 0x72, 0x65, 0x61,
	0x74, 0x65, 0x50, 0x65, 0x72, 0x73, 0x6f, 0x6e, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x12,
	0x12, 0x0a, 0x04, 0x6e, 0x61, 0x6d, 0x65, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x04, 0x6e,
	0x61, 0x6d, 0x65, 0x22, 0x26, 0x0a, 0x14, 0x47, 0x65, 0x74, 0x50, 0x65, 0x72, 0x73, 0x6f, 0x6e,
	0x42, 0x79, 0x49, 0x44, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x12, 0x0e, 0x0a, 0x02, 0x69,
	0x64, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x02, 0x69, 0x64, 0x32, 0xd6, 0x01, 0x0a, 0x07,
	0x50, 0x65, 0x72, 0x73, 0x6f, 0x6e, 0x73, 0x12, 0x47, 0x0a, 0x0a, 0x47, 0x65, 0x74, 0x50, 0x65,
	0x72, 0x73, 0x6f, 0x6e, 0x73, 0x12, 0x1a, 0x2e, 0x65, 0x78, 0x61, 0x6d, 0x70, 0x6c, 0x65, 0x2e,
	0x47, 0x65, 0x74, 0x50, 0x65, 0x72, 0x73, 0x6f, 0x6e, 0x73, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73,
	0x74, 0x1a, 0x1b, 0x2e, 0x65, 0x78, 0x61, 0x6d, 0x70, 0x6c, 0x65, 0x2e, 0x47, 0x65, 0x74, 0x50,
	0x65, 0x72, 0x73, 0x6f, 0x6e, 0x73, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x22, 0x00,
	0x12, 0x41, 0x0a, 0x0d, 0x47, 0x65, 0x74, 0x50, 0x65, 0x72, 0x73, 0x6f, 0x6e, 0x42, 0x79, 0x49,
	0x44, 0x12, 0x1d, 0x2e, 0x65, 0x78, 0x61, 0x6d, 0x70, 0x6c, 0x65, 0x2e, 0x47, 0x65, 0x74, 0x50,
	0x65, 0x72, 0x73, 0x6f, 0x6e, 0x42, 0x79, 0x49, 0x44, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74,
	0x1a, 0x0f, 0x2e, 0x65, 0x78, 0x61, 0x6d, 0x70, 0x6c, 0x65, 0x2e, 0x50, 0x65, 0x72, 0x73, 0x6f,
	0x6e, 0x22, 0x00, 0x12, 0x3f, 0x0a, 0x0c, 0x43, 0x72, 0x65, 0x61, 0x74, 0x65, 0x50, 0x65, 0x72,
	0x73, 0x6f, 0x6e, 0x12, 0x1c, 0x2e, 0x65, 0x78, 0x61, 0x6d, 0x70, 0x6c, 0x65, 0x2e, 0x43, 0x72,
	0x65, 0x61, 0x74, 0x65, 0x50, 0x65, 0x72, 0x73, 0x6f, 0x6e, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73,
	0x74, 0x1a, 0x0f, 0x2e, 0x65, 0x78, 0x61, 0x6d, 0x70, 0x6c, 0x65, 0x2e, 0x50, 0x65, 0x72, 0x73,
	0x6f, 0x6e, 0x22, 0x00, 0x42, 0x3d, 0x5a, 0x3b, 0x67, 0x69, 0x74, 0x68, 0x75, 0x62, 0x2e, 0x63,
	0x6f, 0x6d, 0x2f, 0x70, 0x75, 0x62, 0x6c, 0x69, 0x63, 0x6c, 0x61, 0x62, 0x65, 0x6c, 0x2f, 0x6d,
	0x6f, 0x6e, 0x6f, 0x72, 0x65, 0x70, 0x6f, 0x2f, 0x6f, 0x72, 0x67, 0x73, 0x2f, 0x65, 0x78, 0x61,
	0x6d, 0x70, 0x6c, 0x65, 0x73, 0x2f, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x3b, 0x65, 0x78, 0x61, 0x6d,
	0x70, 0x6c, 0x65, 0x62, 0x06, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x33,
}

var (
	file_orgs_examples_proto_example_proto_rawDescOnce sync.Once
	file_orgs_examples_proto_example_proto_rawDescData = file_orgs_examples_proto_example_proto_rawDesc
)

func file_orgs_examples_proto_example_proto_rawDescGZIP() []byte {
	file_orgs_examples_proto_example_proto_rawDescOnce.Do(func() {
		file_orgs_examples_proto_example_proto_rawDescData = protoimpl.X.CompressGZIP(file_orgs_examples_proto_example_proto_rawDescData)
	})
	return file_orgs_examples_proto_example_proto_rawDescData
}

var file_orgs_examples_proto_example_proto_msgTypes = make([]protoimpl.MessageInfo, 5)
var file_orgs_examples_proto_example_proto_goTypes = []interface{}{
	(*Person)(nil),               // 0: example.Person
	(*GetPersonsRequest)(nil),    // 1: example.GetPersonsRequest
	(*GetPersonsResponse)(nil),   // 2: example.GetPersonsResponse
	(*CreatePersonRequest)(nil),  // 3: example.CreatePersonRequest
	(*GetPersonByIDRequest)(nil), // 4: example.GetPersonByIDRequest
}
var file_orgs_examples_proto_example_proto_depIdxs = []int32{
	0, // 0: example.GetPersonsResponse.persons:type_name -> example.Person
	1, // 1: example.Persons.GetPersons:input_type -> example.GetPersonsRequest
	4, // 2: example.Persons.GetPersonByID:input_type -> example.GetPersonByIDRequest
	3, // 3: example.Persons.CreatePerson:input_type -> example.CreatePersonRequest
	2, // 4: example.Persons.GetPersons:output_type -> example.GetPersonsResponse
	0, // 5: example.Persons.GetPersonByID:output_type -> example.Person
	0, // 6: example.Persons.CreatePerson:output_type -> example.Person
	4, // [4:7] is the sub-list for method output_type
	1, // [1:4] is the sub-list for method input_type
	1, // [1:1] is the sub-list for extension type_name
	1, // [1:1] is the sub-list for extension extendee
	0, // [0:1] is the sub-list for field type_name
}

func init() { file_orgs_examples_proto_example_proto_init() }
func file_orgs_examples_proto_example_proto_init() {
	if File_orgs_examples_proto_example_proto != nil {
		return
	}
	if !protoimpl.UnsafeEnabled {
		file_orgs_examples_proto_example_proto_msgTypes[0].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*Person); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_orgs_examples_proto_example_proto_msgTypes[1].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*GetPersonsRequest); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_orgs_examples_proto_example_proto_msgTypes[2].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*GetPersonsResponse); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_orgs_examples_proto_example_proto_msgTypes[3].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*CreatePersonRequest); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_orgs_examples_proto_example_proto_msgTypes[4].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*GetPersonByIDRequest); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
	}
	type x struct{}
	out := protoimpl.TypeBuilder{
		File: protoimpl.DescBuilder{
			GoPackagePath: reflect.TypeOf(x{}).PkgPath(),
			RawDescriptor: file_orgs_examples_proto_example_proto_rawDesc,
			NumEnums:      0,
			NumMessages:   5,
			NumExtensions: 0,
			NumServices:   1,
		},
		GoTypes:           file_orgs_examples_proto_example_proto_goTypes,
		DependencyIndexes: file_orgs_examples_proto_example_proto_depIdxs,
		MessageInfos:      file_orgs_examples_proto_example_proto_msgTypes,
	}.Build()
	File_orgs_examples_proto_example_proto = out.File
	file_orgs_examples_proto_example_proto_rawDesc = nil
	file_orgs_examples_proto_example_proto_goTypes = nil
	file_orgs_examples_proto_example_proto_depIdxs = nil
}
