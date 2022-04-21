package person

import (
	pb "github.com/publiclabel/monorepo/orgs/examples/proto"
	"google.golang.org/protobuf/types/known/timestamppb"
)

func (p *Person) ToProto() pb.Person {
	return pb.Person{
		Id:        p.ID.String(),
		Username:  p.Username,
		CreatedAt: timestamppb.New(p.CreatedAt),
		UpdatedAt: timestamppb.New(p.UpdatedAt),
	}
}
